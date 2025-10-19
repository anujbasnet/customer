import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Calendar, Clock, MapPin, User } from "lucide-react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "@/hooks/useAppStore";

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<any | null>(null);
  const [business, setBusiness] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { darkModeEnabled } = useAppStore();
  const { t, language } = useTranslation();
  const router = useRouter();

  const BASE_URL = process.env.EXPO_PUBLIC_SERVER_IP;
  const API_BASE_URL = `https://${BASE_URL}/api`;

  // 🔹 Define theme-aware colors here
  const themeColors = {
    background: darkModeEnabled ? "#121212" : "#FFFFFF",
    card: darkModeEnabled ? "#1E1E1E" : colors.card,
    text: darkModeEnabled ? "#FFFFFF" : colors.text,
    textSecondary: darkModeEnabled ? "#CCCCCC" : colors.textSecondary,
    border: darkModeEnabled ? "#333333" : colors.border,
    footerBackground: darkModeEnabled ? "#1A1A1A" : "#FFFFFF",
  };

  const parseTimeLabel = (label: string) => {
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

  const toTimestamp = (dateStr?: string, timeLabel?: string) => {
    if (!dateStr) return 0;
    const [y, mo, d] = String(dateStr)
      .split("-")
      .map((v) => parseInt(v, 10));
    const { h, m } = parseTimeLabel(timeLabel || "");
    return new Date(y, (mo || 1) - 1, d || 1, h, m, 0, 0).getTime();
  };

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await AsyncStorage.getItem("token");
        const { data } = await axios.get(`${API_BASE_URL}/appointments`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const list = (data?.appointments || data || []).filter(Boolean);
        const found = list.find(
          (a: any) => String(a._id || a.id) === String(id)
        );
        if (!found) throw new Error("Appointment not found");
        const normalized = {
          id: String(found.id || found._id || ""),
          businessId: String(found.business_id || ""),
          serviceId: String(found.service_id || ""),
          employeeId: String(found?.specialist?.id || ""),
          employeeName: found?.specialist?.name || "",
          date: found.date,
          time: found.time,
          status: String(found.status || ""),
        };
        let biz: any = null;
        if (normalized.businessId) {
          try {
            const bizRes = await axios.get(
              `${API_BASE_URL}/business/${normalized.businessId}`
            );
            biz = bizRes?.data?.business || bizRes?.data || null;
          } catch {}
        }
        if (!active) return;
        setAppointment(normalized);
        setBusiness(biz);
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || "Failed to load appointment");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <View
        style={[
          styles.notFoundContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <Text
          style={[styles.notFoundText, { color: themeColors.textSecondary }]}
        >
          Loading...
        </Text>
      </View>
    );
  }

  if (!appointment || !business) {
    return (
      <View
        style={[
          styles.notFoundContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <Text
          style={[styles.notFoundText, { color: themeColors.textSecondary }]}
        >
          {error || "Appointment not found"}
        </Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === "en" ? "en-US" : language === "ru" ? "ru-RU" : "uz-UZ"
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return colors.success;
      case "pending":
        return colors.warning;
      case "completed":
        return colors.primary;
      case "cancelled":
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getLocalizedAddress = () => {
    switch (language) {
      case "ru":
        return business.addressRu;
      case "uz":
        return business.addressUz;
      default:
        return business.address;
    }
  };

  const service = business?.services
    ? business.services.find(
        (s: any) => String(s.id) === String(appointment.serviceId)
      )
    : null;
  const formattedPrice = service?.price
    ? String(service.price).replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    : "0";

  const handleCancelAppointment = () => {
    Alert.alert(
      t.appointments.cancel,
      "Are you sure you want to cancel this appointment?",
      [
        { text: t.common.cancel, style: "cancel" },
        {
          text: t.common.confirm,
          onPress: async () => {
            try {
              if (String(appointment.status).toLowerCase() === "booked") {
                Alert.alert(
                  "Not allowed",
                  "This appointment has been confirmed and cannot be cancelled."
                );
                return;
              }
              setLoading(true);
              const token = await AsyncStorage.getItem("token");
              await axios.patch(
                `${API_BASE_URL}/appointments/${appointment.id}/status`,
                { status: "canceled" },
                {
                  headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined,
                }
              );
              setAppointment((prev: any) =>
                prev ? { ...prev, status: "canceled" } : prev
              );
            } catch (e: any) {
              const msg =
                e?.response?.data?.msg ||
                e?.message ||
                "Failed to cancel appointment. Please try again.";
              Alert.alert("Error", String(msg));
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleRescheduleAppointment = () => {
    router.push(
      `/booking/${business.id}?serviceId=${appointment.serviceId}&employeeId=${appointment.employeeId}`
    );
  };

  const rawStatus = String(appointment.status).toLowerCase();
  const canCancel =
    rawStatus !== "booked" &&
    !rawStatus.startsWith("cancel") &&
    rawStatus !== "completed";

  return (
    <>
      <Stack.Screen
        options={{
          title: t.profile.appointments,
          headerBackTitle: t.common.back,
          headerStyle: {
                  backgroundColor: darkModeEnabled ? "#121212" : "#FFFFFF",
                },
                headerTintColor: darkModeEnabled ? "#FFFFFF" : "#000000",
                headerTitleStyle: { fontWeight: "600" },
        }}
      />

      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: canCancel ? 80 : 20 },
          ]}
        >
          <View style={[styles.card, { backgroundColor: themeColors.card }]}>
            <View style={styles.header}>
              <Text style={[styles.businessName, { color: themeColors.text }]}>
                {business.name}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: getStatusColor(
                      String(appointment.status).toLowerCase() === "booked"
                        ? "confirmed"
                        : String(appointment.status).toLowerCase() === "waiting"
                        ? "pending"
                        : String(appointment.status)
                            .toLowerCase()
                            .startsWith("cancel")
                        ? "cancelled"
                        : String(appointment.status).toLowerCase() ===
                          "completed"
                        ? "completed"
                        : "pending"
                    ),
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {
                    t.appointments.status[
                      String(appointment.status).toLowerCase() === "booked"
                        ? "confirmed"
                        : String(appointment.status).toLowerCase() === "waiting"
                        ? "pending"
                        : String(appointment.status)
                            .toLowerCase()
                            .startsWith("cancel")
                        ? "cancelled"
                        : String(appointment.status).toLowerCase() ===
                          "completed"
                        ? "completed"
                        : "pending"
                    ]
                  }
                </Text>
              </View>
            </View>

            <Text
              style={[styles.serviceName, { color: themeColors.textSecondary }]}
            >
              {service?.name || appointment.serviceId}
            </Text>

            <View style={styles.detailsContainer}>
              {[
                {
                  Icon: Calendar,
                  label: "Date",
                  value: formatDate(appointment.date),
                },
                { Icon: Clock, label: "Time", value: appointment.time },
                {
                  Icon: User,
                  label: "Employee",
                  value: appointment.employeeName,
                },
                {
                  Icon: MapPin,
                  label: "Location",
                  value: getLocalizedAddress(),
                },
              ].map(({ Icon, label, value }, i) => (
                <View key={i} style={styles.detailItem}>
                  <Icon size={20} color={colors.primary} />
                  <View style={styles.detailTextContainer}>
                    <Text
                      style={[
                        styles.detailLabel,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {label}
                    </Text>
                    <Text
                      style={[styles.detailValue, { color: themeColors.text }]}
                    >
                      {value}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View
              style={[
                styles.priceContainer,
                { borderTopColor: themeColors.border },
              ]}
            >
              <Text style={[styles.priceLabel, { color: themeColors.text }]}>
                {t.booking.price}
              </Text>
              <Text style={[styles.priceValue, { color: colors.primary }]}>
                {formattedPrice} {t.common.sum}
              </Text>
            </View>
          </View>
        </ScrollView>

        {canCancel && (
          <View
            style={[
              styles.footer,
              {
                backgroundColor: themeColors.footerBackground,
                borderTopColor: themeColors.border,
              },
            ]}
          >
            <Button
              title={t.appointments.cancel}
              onPress={handleCancelAppointment}
              variant="outline"
              loading={loading}
              style={styles.cancelButton}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 20 },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: { fontSize: 16 },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  businessName: { fontSize: 18, fontWeight: "600" },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  serviceName: { fontSize: 16, marginBottom: 16 },
  detailsContainer: { marginBottom: 16 },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  detailTextContainer: { marginLeft: 12 },
  detailLabel: { fontSize: 14, marginBottom: 2 },
  detailValue: { fontSize: 16 },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 16,
  },
  priceLabel: { fontSize: 16 },
  priceValue: { fontSize: 18, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      android: { elevation: 5 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
    }),
  },
  cancelButton: { flex: 1 },
});
