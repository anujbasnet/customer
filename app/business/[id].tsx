import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  Modal,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Image } from "expo-image";
import { Star, MapPin, Clock, Phone, Mail, Heart } from "lucide-react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { ServiceCard } from "@/components/ServiceCard";
import { EmployeeCard } from "@/components/EmployeeCard";
import { getBusinessById as getMockBusinessById } from "@/mocks/businesses";
import axios from "axios";
import { Service, Employee } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function BusinessScreen() {
  const { id, promotionId } = useLocalSearchParams<{
    id: string;
    promotionId?: string;
  }>();
  const [activeTab, setActiveTab] = useState<"services" | "about" | "reviews">(
    "services"
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  const { t, language } = useTranslation();
  const router = useRouter();
  const { isFavorite, addToFavorites, removeFromFavorites } = useAppStore();
  const [authReady, setAuthReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [bookingVisible, setBookingVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Availability map scoped by date: dateStr -> { employeeId -> Set(times) }
  const [bookedByDate, setBookedByDate] = useState<
    Record<string, Record<string, Set<string>>>
  >({});
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const BASE_URL = process.env.EXPO_PUBLIC_SERVER_IP;
  useEffect(() => {
    let active = true;
    // Load token once on mount (and whenever screen refocus via custom effect)
    const loadToken = async () => {
      try {
        const keys = ["token", "Token", "userToken", "BusinessToken"];
        let found: string | null = null;
        for (const k of keys) {
          const val = await AsyncStorage.getItem(k);
          if (val) {
            found = val;
            break;
          }
        }
        if (active) {
          setHasToken(!!found);
          setAuthReady(true);
        }
      } catch (e) {
        if (active) {
          setHasToken(false);
          setAuthReady(true);
        }
      }
    };

    const fetchBusiness = async () => {
      setLoading(true);
      setError("");
      try {
        // Try backend first
        const API_BASE = `https://${BASE_URL}`;
        const res = await axios.get(`${API_BASE}/api/admin/business/${id}`);
        const apiBiz = res.data.business || res.data; // controller wraps in { business }
        // --- Normalize working hours coming from backend ---
        const normalizeWorkingHours = (raw: any) => {
          if (!raw || typeof raw !== "object") return {};
          // Prepare canonicalization helpers first (must exist before possible early return)
          const dayMap: Record<string, string> = {
            monday: "Monday",
            mon: "Monday",
            tuesday: "Tuesday",
            tue: "Tuesday",
            tues: "Tuesday",
            wednesday: "Wednesday",
            wed: "Wednesday",
            thursday: "Thursday",
            thu: "Thursday",
            thurs: "Thursday",
            friday: "Friday",
            fri: "Friday",
            saturday: "Saturday",
            sat: "Saturday",
            sunday: "Sunday",
            sun: "Sunday",
          };
          function canonicalizeDay(k: string) {
            const lower = k.toLowerCase().replace(/[^a-z]/g, "");
            return (dayMap[lower] || k).trim();
          }
          // If already looks like { Monday: {open:'', close:''}, ... }
          const sampleVal = raw[Object.keys(raw)[0]];
          if (
            sampleVal &&
            typeof sampleVal === "object" &&
            ("open" in sampleVal || "close" in sampleVal)
          ) {
            // Still canonicalize keys in case of lowercase / short forms
            const canon: any = {};
            Object.entries(raw).forEach(([k, v]) => {
              canon[canonicalizeDay(k)] = v;
            });
            return canon; // assume already normalized
          }
          const daysOrder = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ];
          const result: Record<
            string,
            { open: string | null; close: string | null }
          > = {};
          const parseTimeRange = (range: string) => {
            if (!range || range.toLowerCase() === "closed")
              return { open: null, close: null };
            const parts = range.split("-");
            if (parts.length === 2)
              return { open: parts[0].trim(), close: parts[1].trim() };
            return { open: null, close: null };
          };
          const expandRange = (key: string, value: string) => {
            if (key.includes("-")) {
              // e.g. "Monday - Friday"
              const [start, end] = key.split("-").map((p) => p.trim());
              const startIdx = daysOrder.indexOf(canonicalizeDay(start));
              const endIdx = daysOrder.indexOf(canonicalizeDay(end));
              if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
                for (let i = startIdx; i <= endIdx; i++) {
                  result[daysOrder[i]] = parseTimeRange(value);
                }
                return;
              }
            }
            // Single day key
            result[canonicalizeDay(key)] = parseTimeRange(value);
          };
          Object.entries(raw).forEach(([k, v]) => expandRange(k, String(v)));
          // Ensure any missing days are marked closed for consistency
          daysOrder.forEach((d) => {
            if (!result[d]) result[d] = { open: null, close: null };
          });
          return result;
        };
        // --- Normalize staff (employees) so EmployeeCard receives .image with data URL or absolute URL ---
        const normalizeAvatar = (val: any): string => {
          if (!val || typeof val !== "string") return "";
          let v = val.trim();
          if (!v) return "";
          // Convert localhost/127 to API_BASE so physical devices can load
          v = v.replace(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, API_BASE);
          // Already data URL
          if (/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(v)) return v;
          // Raw base64 heuristic (allow padding fix)
          if (/^[A-Za-z0-9+/=]+$/.test(v) && v.length > 60) {
            const mod = v.length % 4;
            if (mod) v = v + "=".repeat(4 - mod);
            return `data:image/png;base64,${v}`;
          }
          // Relative path starting with / or uploads/images/img
          if (/^(\/|uploads\/|images\/|img\/)/i.test(v)) {
            if (!v.startsWith("/")) v = "/" + v; // ensure single leading slash
            return API_BASE + v;
          }
          // If looks like protocol-less //domain.com
          if (/^\/\//.test(v)) {
            return "http:" + v; // default to http
          }
          // Absolute URL (http/https)
          if (/^https?:\/\//i.test(v)) return v;
          // Reject data that is too short or not interpretable
          return "";
        };
        const mapStaff = (staffArr: any): any[] => {
          if (!Array.isArray(staffArr)) return [];
          return staffArr.map((s: any) => {
            const rawAvatar =
              s.avatarUrl || s.avatar || s.image || s.photo || "";
            return {
              // Keep original fields spread last so original metadata retained
              id:
                s.id ||
                s._id ||
                s.staffId ||
                s.employeeId ||
                Math.random().toString(36).slice(2),
              name: s.name || s.fullName || s.full_name || "Employee",
              position: s.position || s.title || s.role || "",
              image: normalizeAvatar(rawAvatar), // what EmployeeCard expects
              rawAvatar,
              ...s,
            };
          });
        };
        // Normalize fields to match component expectations
        const normalized = {
          id: apiBiz.id || apiBiz._id || id,
          name: apiBiz.name || apiBiz.full_name || "Business",
          category: apiBiz.service_type || "general",
          address: apiBiz.address || "",
          addressRu: apiBiz.addressRu || apiBiz.address || "",
          addressUz: apiBiz.addressUz || apiBiz.address || "",
          phone: apiBiz.phone || apiBiz.phone_number || "",
          email: apiBiz.email || "",
          description: apiBiz.description || "",
          descriptionRu: apiBiz.descriptionRu || apiBiz.description || "",
          descriptionUz: apiBiz.descriptionUz || apiBiz.description || "",
          rating: apiBiz.rating || 0,
          reviewCount: apiBiz.reviewCount || 0,
          image:
            normalizeAvatar(
              apiBiz.coverPhotoUrl ||
                apiBiz.imageUrl ||
                apiBiz.logoUrl ||
                apiBiz.image
            ) || "https://via.placeholder.com/800x400?text=Business",
          employees: mapStaff(apiBiz.staff || []),
          services: apiBiz.services || [],
          workingHours: normalizeWorkingHours(apiBiz.workingHours || {}),
          portfolio: apiBiz.portfolio || [],
        };
        if (active) setBusiness(normalized);
      } catch (err) {
        // fallback to mock
        const mock = getMockBusinessById(id as string);
        if (mock) {
          if (active) setBusiness(mock);
        } else {
          if (active) setError("Business not found");
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchBusiness();
    loadToken();
    return () => {
      active = false;
    };
  }, [id]);

  // Auto-select promotional service if promotionId is provided
  React.useEffect(() => {
    if (promotionId && business) {
      const promotionalService = business.services.find(
        (s: any) => s.isPromotion && s.promotionId === promotionId
      );
      if (promotionalService) {
        setSelectedService(promotionalService);
      }
    }
  }, [promotionId, business]);

  // --- Move all hook calls (useMemo) above any early returns to keep hook order stable ---
  // Date list (next 14 days)
  const dateOptions = React.useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const getDayKey = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "long" });
  // Local date (YYYY-MM-DD) independent of timezone offsets (avoids previous-day bleed when UTC rolls)
  const formatLocalDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Robust time parser supporting formats: HH:MM, H:MM, HHMM, HH.MM, 9am, 9:30pm, 09:00 AM
  const parseTimeString = (raw: string): { h: number; m: number } | null => {
    if (!raw) return null;
    let s = raw.trim().toLowerCase();
    if (s === "closed") return null;
    // Replace '.' with ':'
    s = s.replace(/\./g, ":");
    // Extract am/pm
    let isPM = false,
      isAM = false;
    if (/(am|pm)$/.test(s)) {
      isPM = s.endsWith("pm");
      isAM = s.endsWith("am");
      s = s.replace(/(am|pm)$/, "").trim();
    }
    // HHMM -> HH:MM
    if (/^\d{3,4}$/.test(s)) {
      const pad = s.length === 3 ? "0" + s : s;
      s = pad.slice(0, 2) + ":" + pad.slice(2);
    }
    if (!s.includes(":")) s = s + ":00";
    const [hhStr, mmStr = "0"] = s.split(":");
    const hNum = Number(hhStr);
    const mNum = Number(mmStr);
    if (Number.isNaN(hNum) || Number.isNaN(mNum)) return null;
    let hAdj = hNum;
    if (isPM && hAdj < 12) hAdj += 12; // 1pm ->13
    if (isAM && hAdj === 12) hAdj = 0; // 12am ->0
    if (hAdj < 0 || hAdj > 23 || mNum < 0 || mNum > 59) return null;
    return { h: hAdj, m: mNum };
  };

  const isDayClosed = (d: Date): boolean => {
    if (!business?.workingHours) return true; // treat as closed until loaded
    const dayKey = getDayKey(d).trim();
    let hours = business.workingHours[dayKey];
    if (!hours) {
      const alt = Object.keys(business.workingHours).find(
        (k) => k.toLowerCase() === dayKey.toLowerCase()
      );
      if (alt) hours = business.workingHours[alt];
    }
    if (!hours) return true;
    if (typeof hours === "string") {
      return hours.trim().toLowerCase().includes("closed");
    }
    const openVal = (hours.open || hours.openTime || hours.start || "").trim();
    const closeVal = (hours.close || hours.closeTime || hours.end || "").trim();
    if (!openVal || !closeVal) return true;
    if (
      openVal.toLowerCase() === "closed" ||
      closeVal.toLowerCase() === "closed"
    )
      return true;
    const openParsed = parseTimeString(openVal);
    const closeParsed = parseTimeString(closeVal);
    if (!openParsed || !closeParsed) return true;
    const openMinutes = openParsed.h * 60 + openParsed.m;
    const closeMinutes = closeParsed.h * 60 + closeParsed.m;
    return closeMinutes <= openMinutes; // invalid or zero-length treated as closed
  };

  // Hoisted before early returns so its dependent useMemo always runs each render
  const generateTimeSlots = (d: Date): string[] => {
    if (!business?.workingHours) return [];
    const dayKey = getDayKey(d).trim(); // Monday, Tuesday ...
    let hours = business.workingHours[dayKey];
    if (!hours) {
      // Attempt loose match (some APIs may return lowercase keys)
      const alt = Object.keys(business.workingHours).find(
        (k) => k.toLowerCase() === dayKey.toLowerCase()
      );
      if (alt) hours = business.workingHours[alt];
    }
    if (!hours) return [];
    // Handle string form "09:00-18:00" or "09:00 - 18:00" or 'Closed'
    if (typeof hours === "string") {
      if (!hours || hours.toLowerCase().includes("closed")) return [];
      const range = hours.replace(/\s+/g, "");
      const parts = range.split("-");
      if (parts.length === 2) {
        hours = { open: parts[0], close: parts[1] };
      } else {
        return [];
      }
    }
    // Support alternate property names (openTime/closeTime, start/end)
    const openVal = (hours.open || hours.openTime || hours.start || "").trim();
    const closeVal = (hours.close || hours.closeTime || hours.end || "").trim();
    const openParsed = parseTimeString(openVal);
    const closeParsed = parseTimeString(closeVal);
    if (!openParsed || !closeParsed) return [];
    const start = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      openParsed.h,
      openParsed.m,
      0,
      0
    );
    const end = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      closeParsed.h,
      closeParsed.m,
      0,
      0
    );
    if (end <= start) return [];
    const slots: string[] = [];
    const cursor = new Date(start);
    while (cursor < end) {
      const hh = String(cursor.getHours()).padStart(2, "0");
      const mm = String(cursor.getMinutes()).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
      cursor.setMinutes(cursor.getMinutes() + 30);
    }
    return slots;
  };

  const timeSlots = React.useMemo(
    () => generateTimeSlots(selectedDate),
    [selectedDate, business]
  );

  // Reset selectedTime when date changes to avoid carrying a time across days
  useEffect(() => {
    // Whenever the selectedDate changes and modal open, wipe old map until new fetch repopulates
    if (bookingVisible) {
      setSelectedTime(null);
    }
  }, [selectedDate, bookingVisible]);

  // Fetch availability (all employees for the selected date) when modal visible or date/service changes.
  useEffect(() => {
    const fetchAllAvailability = async () => {
      if (!business || !bookingVisible) return;
      try {
        setAvailabilityLoading(true);
        const API_BASE = `https://${BASE_URL}`;
        const dateStr = formatLocalDate(selectedDate);
        const baseUrl =
          `${API_BASE}/api/appointments/availability?business_id=${business.id}&date=${dateStr}` +
          (selectedService ? `&service_id=${selectedService.id}` : "");
        let map: Record<string, Set<string>> = {};
        try {
          const res = await axios.get(baseUrl);
          const bookings = res.data.bookings || res.data || [];
          bookings.forEach((b: any) => {
            if (!b || !b.time) return;
            // Backend returns specialist_id (controller), but also guard for alternative shapes
            const empId =
              b.specialist_id ||
              b.specialistId ||
              b.specialist?.id ||
              b.employeeId ||
              b.employee_id ||
              b.staffId ||
              b.staff_id;
            if (!empId) return; // skip if no specialist id (we only block per-employee duplicates)
            if (!map[empId]) map[empId] = new Set();
            map[empId].add(b.time);
          });
        } catch (inner) {
          // If request totally fails, leave map empty (all slots appear free)
          console.warn(
            "Availability fetch failed",
            (inner as any)?.message || inner
          );
        }
        setBookedByDate((prev) => ({ ...prev, [dateStr]: map }));
      } catch {
        const failedDate = formatLocalDate(selectedDate);
        setBookedByDate((prev) => ({
          ...prev,
          [failedDate]: prev[failedDate] || {},
        }));
      } finally {
        setAvailabilityLoading(false);
      }
    };
    fetchAllAvailability();
  }, [bookingVisible, selectedDate, selectedService?.id, business?.id]);

  // Memo of selected employee's booked times for quick lookup
  const selectedEmployeeBookedTimes = React.useMemo(() => {
    if (!selectedEmployee) return new Set<string>();
    const ds = formatLocalDate(selectedDate);
    return bookedByDate[ds]?.[selectedEmployee.id] || new Set<string>();
  }, [selectedEmployee?.id, bookedByDate, selectedDate]);

  if (loading) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>
          {t.common.loading || "Loading..."}
        </Text>
      </View>
    );
  }
  if (!business) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>{error || "Business not found"}</Text>
      </View>
    );
  }

  const getLocalizedDescription = () => {
    switch (language) {
      case "ru":
        return business.descriptionRu;
      case "uz":
        return business.descriptionUz;
      default:
        return business.description;
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

  const getLocalizedServiceName = (service: Service) => {
    switch (language) {
      case "ru":
        return service.nameRu || service.name;
      case "uz":
        return service.nameUz || service.name;
      default:
        return service.name;
    }
  };

  const getLocalizedServiceDescription = (service: Service) => {
    switch (language) {
      case "ru":
        return service.descriptionRu || service.description;
      case "uz":
        return service.descriptionUz || service.description;
      default:
        return service.description;
    }
  };

  const handleServicePress = (service: Service) => {
    setSelectedService(service);
  };

  const handleEmployeePress = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleBookAppointment = async () => {
    // If we already know user is authenticated, skip storage scan & prompt
    if (authReady && hasToken) {
      let serviceToUse = selectedService;
      if (!serviceToUse && business?.services?.length > 0) {
        serviceToUse = business.services[0];
        setSelectedService(serviceToUse);
      }
      if (!serviceToUse) {
        Alert.alert("No Services", "No services available to book.");
        return;
      }
      setBookingVisible(true);
      return;
    }
    // Fallback: perform one-time token lookup if not yet marked logged in
    try {
      const tokenKeys = ["token", "Token", "userToken", "BusinessToken"];
      for (const k of tokenKeys) {
        const v = await AsyncStorage.getItem(k);
        if (v) {
          setHasToken(true);
          break;
        }
      }
      if (!hasToken) {
        Alert.alert(
          "Login Required",
          "You need to login to book an appointment",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Login", onPress: () => router.push("/(auth)/login") },
          ]
        );
        return;
      }
      // If token discovered just now, reopen with updated state next tick
      setTimeout(() => handleBookAppointment(), 0);
    } catch (e) {
      console.warn("Booking auth fallback check failed", e);
      Alert.alert("Error", "Unable to verify login status. Please try again.");
    }
  };

  const confirmBooking = async () => {
    if (!selectedService) {
      Alert.alert("Select Service", "Please select a service first.");
      return;
    }
    if (!selectedTime) {
      Alert.alert("Select Time", "Please select a time slot.");
      return;
    }
    // Double-book guard: if selected employee has this time already booked re-prompt
    if (selectedEmployee) {
      const dateStrInner = formatLocalDate(selectedDate);
      const empSet = bookedByDate[dateStrInner]?.[selectedEmployee.id];
      if (empSet?.has(selectedTime)) {
        Alert.alert(
          "Time Unavailable",
          "This specialist is already booked at that time. Please choose another time or specialist."
        );
        return;
      }
    }
    const dateStr = formatLocalDate(selectedDate);
    // Retrieve token for authenticated POST
    const tokenKeys = ["token", "Token", "userToken", "BusinessToken"];
    let token: string | null = null;
    for (const k of tokenKeys) {
      const v = await AsyncStorage.getItem(k);
      if (v) {
        token = v;
        break;
      }
    }
    if (!token) {
      Alert.alert("Login Required", "Session expired. Please login again.");
      return;
    }
    try {
      setAvailabilityLoading(true);
      const API_BASE = `https://${BASE_URL}`;
      const payload: any = {
        business_id: business.id,
        service_id: selectedService.id,
        date: dateStr,
        time: selectedTime,
      };
      if (selectedEmployee) payload.specialist_id = selectedEmployee.id;
      const res = await axios.post(`${API_BASE}/api/appointments`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookingVisible(false);
      // Optimistically update local availability map so user can't immediately re-book same slot
      if (selectedEmployee) {
        const dateStrInner = formatLocalDate(selectedDate);
        setBookedByDate((prev) => {
          const dayMap = { ...(prev[dateStrInner] || {}) } as Record<
            string,
            Set<string>
          >;
          const cur = new Set(dayMap[selectedEmployee.id] || []);
          cur.add(selectedTime);
          dayMap[selectedEmployee.id] = cur;
          return { ...prev, [dateStrInner]: dayMap };
        });
      }
      alert("Appointment request sent successfully.");
    } catch (e: any) {
      console.error(
        "Create appointment failed",
        e?.response?.data || e?.message
      );
      Alert.alert(
        "Error",
        e?.response?.data?.msg || "Failed to create appointment."
      );
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const renderBookingModal = () => (
    <Modal
      visible={bookingVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setBookingVisible(false)}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{t.business.bookAppointment}</Text>
          <Text style={styles.modalSectionLabel}>Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.datesRow}
          >
            {dateOptions.map((d) => {
              const dayShort = d.toLocaleDateString("en-US", {
                weekday: "short",
              });
              const dateNum = d.getDate();
              const selected = d.toDateString() === selectedDate.toDateString();
              const closed = isDayClosed(d);
              return (
                <TouchableOpacity
                  key={d.toISOString()}
                  style={[
                    styles.dateChip,
                    selected && styles.dateChipSelected,
                    closed && styles.dateChipDisabled,
                  ]}
                  disabled={closed}
                  onPress={() => {
                    setSelectedDate(d);
                    setSelectedTime(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      selected && styles.dateChipTextSelected,
                    ]}
                  >
                    {dayShort}
                  </Text>
                  <Text
                    style={[
                      styles.dateChipNumber,
                      selected && styles.dateChipTextSelected,
                    ]}
                  >
                    {dateNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <Text style={styles.modalSectionLabel}>Time</Text>
          {timeSlots.length === 0 ? (
            <Text style={styles.emptySlotsText}>
              {t.business.closed || "Closed"}
            </Text>
          ) : (
            <ScrollView
              style={styles.timesWrapper}
              contentContainerStyle={styles.timesContent}
            >
              <View style={styles.timesGrid}>
                {timeSlots.map((ts) => {
                  const selected = ts === selectedTime;
                  // Disable if past (same day) or booked for selected employee
                  const dateStr = selectedDate.toISOString().split("T")[0];
                  const now = new Date();
                  const slotDate = new Date(selectedDate);
                  const [sh, sm] = ts.split(":").map(Number);
                  slotDate.setHours(sh, sm, 0, 0);
                  const isToday =
                    dateStr === new Date().toISOString().split("T")[0];
                  const isPast = isToday && slotDate < now;
                  const isBooked = selectedEmployeeBookedTimes.has(ts);
                  const disabled = isPast || isBooked;
                  return (
                    <TouchableOpacity
                      key={ts}
                      disabled={disabled}
                      style={[
                        styles.timeSlot,
                        disabled && styles.timeSlotDisabled,
                        selected && styles.timeSlotSelected,
                      ]}
                      onPress={() => !disabled && setSelectedTime(ts)}
                    >
                      <Text
                        style={[
                          styles.timeSlotText,
                          disabled && styles.timeSlotTextDisabled,
                          selected && styles.timeSlotTextSelected,
                        ]}
                      >
                        {ts}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
          {availabilityLoading && (
            <Text style={styles.availabilityLoadingText}>
              {t.common.loading || "Loading..."}
            </Text>
          )}
          <View style={styles.modalButtonsRow}>
            <Button
              title={t.common.cancel || "Cancel"}
              style={styles.modalButton}
              onPress={() => setBookingVisible(false)}
            />
            <Button
              title={t.common.confirm || "Confirm"}
              style={styles.modalButton}
              onPress={confirmBooking}
              disabled={!selectedTime}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  const formatWorkingHours = (day: keyof typeof business.workingHours) => {
    const hours = business.workingHours[day];
    if (!hours) return t.business.closed;
    // If it's a string (legacy) just show or interpret closed
    if (typeof hours === "string") {
      if (hours.toLowerCase() === "closed") return t.business.closed;
      // Try parse "HH:MM - HH:MM"
      const parts = hours.split("-");
      if (parts.length === 2) return `${parts[0].trim()} - ${parts[1].trim()}`;
      return hours;
    }
    if (!hours.open || !hours.close) return t.business.closed;
    return `${hours.open} - ${hours.close}`;
  };

  const getDayName = (day: string) => {
    if (!t || !t.days) return day;
    const variants = [
      day,
      day.toLowerCase(),
      day.slice(0, 3).toLowerCase(), // Mon, Tue, etc.
      day.replace(/\s+/g, "").toLowerCase(), // mondayfriday style (just in case)
    ];
    for (const v of variants) {
      if ((t.days as any)[v]) return (t.days as any)[v];
    }
    return day; // fallback raw
  };

  const orderedDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Safely resolve category translation with fallbacks
  const getCategoryLabel = () => {
    if (!business) return "";
    const raw =
      business.category || business.service_type || business.service_name;
    if (!raw) return "";
    const cats: any =
      (t as any).categories ||
      (t.business && (t.business as any).categories) ||
      {};
    // Try several key normalization strategies
    const direct = cats[raw];
    if (direct) return direct;
    const lower = cats[raw.toLowerCase()];
    if (lower) return lower;
    const underscoredKey = raw.replace(/\s+/g, "_").toLowerCase();
    const underscored = cats[underscoredKey];
    if (underscored) return underscored;
    // Fallback to raw value
    return raw;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: business.name,
          headerBackTitle: t.common.back,
        }}
      />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          <Image
            source={{ uri: business.image }}
            style={styles.coverImage}
            contentFit="cover"
          />

          <View style={styles.header}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{business.name}</Text>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => {
                  if (isFavorite(business.id)) {
                    removeFromFavorites(business.id);
                  } else {
                    addToFavorites(business);
                  }
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Heart
                  size={24}
                  color={
                    isFavorite(business.id)
                      ? colors.error
                      : colors.textSecondary
                  }
                  fill={isFavorite(business.id) ? colors.error : "transparent"}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.category}>{getCategoryLabel()}</Text>

            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Text style={styles.rating}>{business.rating}</Text>
              <Text style={styles.reviewCount}>({business.reviewCount})</Text>
            </View>

            <View style={styles.contactContainer}>
              <View style={styles.contactItem}>
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={styles.contactText}>{getLocalizedAddress()}</Text>
              </View>

              <View style={styles.contactItem}>
                <Phone size={16} color={colors.textSecondary} />
                <Text style={styles.contactText}>{business.phone}</Text>
              </View>

              <View style={styles.contactItem}>
                <Mail size={16} color={colors.textSecondary} />
                <Text style={styles.contactText}>{business.email}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "services" && styles.activeTab]}
              onPress={() => setActiveTab("services")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "services" && styles.activeTabText,
                ]}
              >
                {t.business.services}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "about" && styles.activeTab]}
              onPress={() => setActiveTab("about")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "about" && styles.activeTabText,
                ]}
              >
                {t.business.about}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "reviews" && styles.activeTab]}
              onPress={() => setActiveTab("reviews")}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "reviews" && styles.activeTabText,
                ]}
              >
                {t.business.reviews}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {activeTab === "services" && (
              <View>
                {business.employees.length > 1 && (
                  <View style={styles.employeesSection}>
                    <Text style={styles.sectionTitle}>
                      {t.business.employees}
                    </Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.employeesList}
                      scrollEventThrottle={16}
                    >
                      {business.employees.map((employee: any) => {
                        const dateStrEmp = formatLocalDate(selectedDate);
                        const bookedSet =
                          bookedByDate[dateStrEmp]?.[employee.id];
                        const isBookedAtSelectedTime = !!(
                          selectedTime && bookedSet?.has(selectedTime)
                        );
                        return (
                          <View
                            key={employee.id}
                            style={{ position: "relative" }}
                          >
                            <EmployeeCard
                              employee={employee}
                              selected={selectedEmployee?.id === employee.id}
                              // Prevent selecting an employee already booked at chosen time
                              onPress={(emp: any) => {
                                if (isBookedAtSelectedTime) return; // no-op when booked
                                handleEmployeePress(emp);
                              }}
                            />
                            {isBookedAtSelectedTime && (
                              <View
                                style={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  backgroundColor: "rgba(0,0,0,0.6)",
                                  paddingHorizontal: 6,
                                  paddingVertical: 2,
                                  borderRadius: 6,
                                }}
                              >
                                <Text style={{ color: "#fff", fontSize: 10 }}>
                                  {(t.business as any)?.booked || "Booked"}
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}

                <Text style={styles.sectionTitle}>{t.business.services}</Text>
                {promotionId && (
                  <View style={styles.promotionNotice}>
                    <Text style={styles.promotionNoticeText}>
                      🎉 Special promotion applied! Select a service to see
                      discounted pricing.
                    </Text>
                  </View>
                )}
                {business.services.length > 0 ? (
                  business.services.map((service: any) => {
                    // Check if this service is part of the promotion
                    const isPromotionalService =
                      service.isPromotion &&
                      service.promotionId === promotionId;

                    return (
                      <ServiceCard
                        key={service.id}
                        service={{
                          ...service,
                          name: getLocalizedServiceName(service),
                          description: getLocalizedServiceDescription(service),
                        }}
                        selected={
                          selectedService?.id === service.id ||
                          isPromotionalService
                        }
                        onPress={handleServicePress}
                        currencySymbol={t.common.sum}
                      />
                    );
                  })
                ) : (
                  <Text style={styles.emptyText}>{t.business.noServices}</Text>
                )}
              </View>
            )}

            {activeTab === "about" && (
              <View>
                <Text style={styles.description}>
                  {getLocalizedDescription()}
                </Text>

                <Text style={styles.sectionTitle}>
                  {t.business.workingHours}
                </Text>
                <View style={styles.workingHours}>
                  {orderedDays.map((day) => (
                    <View key={day} style={styles.workingHoursItem}>
                      <Text style={styles.day}>{getDayName(day)}</Text>
                      <Text style={styles.hours}>
                        {formatWorkingHours(
                          day as keyof typeof business.workingHours
                        )}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.sectionTitle}>{t.business.address}</Text>
                <View style={styles.addressDetailContainer}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={styles.addressDetail}>
                    {getLocalizedAddress()}
                  </Text>
                </View>

                {business.portfolio && business.portfolio.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>
                      {t.business.portfolio}
                    </Text>
                    <View style={styles.portfolioContainer}>
                      {business.portfolio.map((item: any) => (
                        <View key={item.id} style={styles.portfolioItem}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.portfolioImage}
                            contentFit="cover"
                          />
                          <View style={styles.portfolioContent}>
                            <Text style={styles.portfolioTitle}>
                              {item.title}
                            </Text>
                            {item.description && (
                              <Text style={styles.portfolioDescription}>
                                {item.description}
                              </Text>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            )}

            {activeTab === "reviews" && (
              <View style={styles.reviewsContainer}>
                <Text style={styles.reviewsText}>Reviews coming soon...</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={t.business.bookAppointment}
            onPress={handleBookAppointment}
            disabled={business.services.length === 0 || !authReady}
            style={styles.bookButton}
          />
        </View>
        {renderBookingModal()}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 80, // Extra padding for footer
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  coverImage: {
    width: width,
    height: 200,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 12,
  },
  category: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  contactContainer: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: "500",
  },
  content: {
    padding: 16,
  },
  employeesSection: {
    marginBottom: 24,
  },
  employeesList: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: 24,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  workingHours: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  workingHoursItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  day: {
    fontSize: 14,
    color: colors.text,
  },
  hours: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addressDetailContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
  },
  addressDetail: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  reviewsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  reviewsText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
    }),
  },
  bookButton: {
    width: "100%",
  },
  portfolioContainer: {
    gap: 16,
    marginTop: 16,
  },
  portfolioItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  portfolioImage: {
    width: "100%",
    height: 200,
  },
  portfolioContent: {
    padding: 16,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  portfolioDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  promotionNotice: {
    backgroundColor: colors.primary + "15",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  promotionNoticeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  modalSectionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 8,
  },
  datesRow: {
    marginBottom: 12,
  },
  dateChip: {
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },
  dateChipSelected: {
    backgroundColor: colors.primary,
  },
  dateChipDisabled: {
    opacity: 0.35,
  },
  dateChipText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dateChipTextSelected: {
    color: "#fff",
  },
  dateChipNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  timesWrapper: {
    maxHeight: 200,
    marginBottom: 12,
  },
  timesContent: {
    paddingBottom: 8,
  },
  timesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: colors.card,
    marginRight: 8,
    marginBottom: 8,
  },
  timeSlotSelected: {
    backgroundColor: colors.primary,
  },
  timeSlotDisabled: {
    opacity: 0.35,
  },
  timeSlotText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  timeSlotTextDisabled: {
    textDecorationLine: "line-through",
  },
  timeSlotTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  emptySlotsText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  availabilityLoadingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});
