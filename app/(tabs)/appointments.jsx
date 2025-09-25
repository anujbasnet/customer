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

const API_URL = "http://192.168.1.4:5000/api"; // Replace with your backend IP

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState("upcoming"); // 'upcoming' or 'past'
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

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
      setAppointments(res.data.appointments);
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

  const filteredAppointments = appointments.filter((a) =>
    activeTab === "upcoming" ? a.status === "upcoming" : a.status === "past"
  );

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
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            {t.profile.upcoming}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "past" && styles.activeTabText,
            ]}
          >
            {t.profile.past}
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 24 }}
        />
      ) : filteredAppointments.length > 0 ? (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onPress={() => handleAppointmentPress(item)}
            />
          )}
          contentContainerStyle={styles.appointmentsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t.appointments.noAppointments}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
