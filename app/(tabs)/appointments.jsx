import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "@/constants/colors";
import { AppointmentCard } from "@/components/AppointmentCard";
import { Button } from "@/components/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_IP;
const API_URL = `https://${BASE_URL}/api`;

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'past'
  const [appointments, setAppointments] = useState([]); // unified list; we'll split by time in render
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { selectedCity, isGuestMode, darkModeEnabled } = useAppStore();
  const { t } = useTranslation();
  const router = useRouter();

  // Load token from AsyncStorage
  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  };

  const fetchAppointments = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = (res?.data?.appointments || res?.data || []).filter(Boolean);
      // Bulk fetch businesses to enrich display fields
      const bizIds = Array.from(
        new Set(list.map((a) => a.business_id).filter(Boolean))
      );
      const bizMap = {};
      await Promise.all(
        bizIds.map(async (id) => {
          try {
            const bizRes = await axios.get(`${API_URL}/business/${id}`);
            bizMap[id] = bizRes?.data?.business || bizRes?.data;
          } catch {}
        })
      );

      // Helpers for time handling and display
      const parseTimeLabel = (label) => {
        if (!label) return { h: 0, m: 0 };
        const s = String(label).trim().toLowerCase();
        const am = s.includes("am");
        const pm = s.includes("pm");
        const match = s.match(/(\d{1,2}):(\d{2})/);
        let h = 0,
          m = 0;
        if (match) {
          h = parseInt(match[1], 10);
          m = parseInt(match[2], 10);
          if (pm && h < 12) h += 12;
          if (am && h === 12) h = 0;
        }
        return { h, m };
      };
      const toTimestamp = (dateStr, timeLabel) => {
        if (!dateStr) return 0;
        const [y, mo, d] = String(dateStr)
          .split("-")
          .map((v) => parseInt(v, 10));
        const { h, m } = parseTimeLabel(timeLabel);
        return new Date(y, (mo || 1) - 1, d || 1, h, m, 0, 0).getTime();
      };
      const formatTimeForDisplay = (label) => {
        const { h, m } = parseTimeLabel(label);
        const suffix = h >= 12 ? "PM" : "AM";
        const hh12 = h % 12 || 12;
        const mm = String(m).padStart(2, "0");
        return `${hh12}:${mm} ${suffix}`;
      };
      const mapStatus = (raw) => {
        const s = String(raw || "")
          .toLowerCase()
          .replace(/\s|_/g, "");
        if (s === "booked") return "confirmed";
        if (s === "waiting") return "pending";
        if (s === "notbooked" || s === "canceled" || s === "cancelled")
          return "cancelled";
        if (s === "completed") return "completed";
        return "pending";
      };

      const mapped = list.map((a) => {
        const biz = a.business_id ? bizMap[a.business_id] : undefined;
        const businessName =
          biz?.full_name || biz?.name || String(a.business_id || "");
        const svc = Array.isArray(biz?.services)
          ? biz.services.find((s) => String(s.id) === String(a.service_id))
          : null;
        const serviceName = svc?.name || String(a.service_id || "");
        const duration = Number(svc?.duration || 0);
        const price = Number(svc?.price || 0);
        const employeeName =
          a?.specialist?.name ||
          (Array.isArray(biz?.staff)
            ? biz.staff.find((s) => String(s.id) === String(a?.specialist?.id))
                ?.name
            : "") ||
          "";
        return {
          id: String(a._id || a.id || ""),
          businessId: String(a.business_id || ""),
          businessName,
          serviceId: String(a.service_id || ""),
          serviceName,
          employeeId: String(a?.specialist?.id || ""),
          employeeName,
          date: a.date,
          time: formatTimeForDisplay(a.time),
          _timeRaw: a.time, // keep raw for sorting if needed
          duration,
          price,
          status: mapStatus(a.status),
          _ts: toTimestamp(a.date, a.time),
        };
      });
      setAppointments(mapped);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAppointments();
    } finally {
      setRefreshing(false);
    }
  };

  const now = Date.now();
  const filteredAppointments = appointments
    .filter((a) => {
      const isUpcoming = (a._ts ?? 0) >= now;
      return activeTab === "upcoming" ? isUpcoming : !isUpcoming;
    })
    .sort((a, b) => {
      const da = a._ts ?? 0;
      const db = b._ts ?? 0;
      // Arrange strictly by time (ascending) in both tabs
      return da - db;
    });

  const handleAppointmentPress = (appointment) => {
    router.push(`/appointment/${appointment.id}`);
  };

  const handleLogin = () => router.push("/(auth)/login");

  // Show login screen if no token
  if (!token) {
    return (
      <View style={styles.notAuthContainer}>
        <Text style={styles.notAuthTitle}>{t.appointments.noAppointments}</Text>
        <Text style={styles.notAuthText}>
          Please login or register to view and manage your appointments
        </Text>
        <Button
          title={t.auth.login}
          onPress={handleLogin}
          style={styles.loginButton}
        />
      </View>
    );
  }

  return (
   <View
  style={[
    styles.container,
    { backgroundColor: darkModeEnabled ? "#121212" : "#FFFFFF" },
  ]}
>
  <View style={styles.tabsContainer}>
    <TouchableOpacity
      style={[
        styles.tab,
        activeTab === "upcoming" && {
          borderBottomWidth: 2,
          borderBottomColor: darkModeEnabled ? "#0A84FF" : "#007AFF",
        },
      ]}
      onPress={() => setActiveTab("upcoming")}
    >
      <Text
        style={[
          styles.tabText,
          {
            color:
              activeTab === "upcoming"
                ? darkModeEnabled
                  ? "#0A84FF"
                  : "#007AFF"
                : darkModeEnabled
                ? "#AAAAAA"
                : "#666666",
          },
        ]}
      >
        {t.profile.upcoming}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.tab,
        activeTab === "past" && {
          borderBottomWidth: 2,
          borderBottomColor: darkModeEnabled ? "#0A84FF" : "#007AFF",
        },
      ]}
      onPress={() => setActiveTab("past")}
    >
      <Text
        style={[
          styles.tabText,
          {
            color:
              activeTab === "past"
                ? darkModeEnabled
                  ? "#0A84FF"
                  : "#007AFF"
                : darkModeEnabled
                ? "#AAAAAA"
                : "#666666",
          },
        ]}
      >
        {t.profile.past}
      </Text>
    </TouchableOpacity>
  </View>

  {loading && appointments.length === 0 ? (
    <ActivityIndicator
      size="large"
      color={darkModeEnabled ? "#0A84FF" : "#007AFF"}
      style={{ marginTop: 24 }}
    />
  ) : filteredAppointments.length > 0 ? (
    <FlatList
      data={filteredAppointments}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <AppointmentCard
          appointment={item}
          onPress={() => handleAppointmentPress(item)}
          darkMode={darkModeEnabled} // pass to card if needed
        />
      )}
      contentContainerStyle={styles.appointmentsList}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  ) : (
    <View style={styles.emptyContainer}>
      <Text
        style={{
          color: darkModeEnabled ? "#AAAAAA" : "#666666",
          fontSize: 16,
          textAlign: "center",
        }}
      >
        {t.appointments.noAppointments}
      </Text>
    </View>
  )}
</View>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  notAuthContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  notAuthTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  notAuthText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: { width: "100%", maxWidth: 300 },
  tabsContainer: {
    flexDirection: "row",
  },
  tab: { flex: 1, paddingVertical: 16, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { fontSize: 16, color: colors.textSecondary },
  activeTabText: { color: colors.primary, fontWeight: "500" },
  appointmentsList: { padding: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyText: { fontSize: 16, color: colors.textSecondary, textAlign: "center" },
});
