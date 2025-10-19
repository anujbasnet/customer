import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Search, MapPin, Scissors } from "lucide-react-native";

import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";
import { colors } from "@/constants/colors";
import { CategoryCircle } from "@/components/CategoryCircle";
import { BusinessCard } from "@/components/BusinessCard";
import { categories } from "@/mocks/categories";
import { cities } from "@/mocks/cities";
import { getPromotions } from "@/mocks/promotions";
import { AppointmentReminder } from "@/components/AppointmentReminder";
import { PromotionCard } from "@/components/PromotionCard";
import { CitySelectionModal } from "@/components/CitySelectionModal";

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedCity, isGuestMode, darkModeEnabled } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllPromotions, setShowAllPromotions] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const promotions = getPromotions();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [apptError, setApptError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const currentCity = cities.find((city) => city.id === selectedCity);

  const BASE_URL = process.env.EXPO_PUBLIC_SERVER_IP;
  const API_BASE_URL = `https://${BASE_URL}/api`;

  // ===== Time utils =====
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

  // ===== Fetch Appointments =====
  const fetchUpcomingAppointments = async () => {
    setApptLoading(true);
    setApptError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const list = (data?.appointments || data || []).filter(Boolean);
      const now = Date.now();
      const future = list
        .filter((a) => String(a?.status || "").toLowerCase() === "booked")
        .filter((a) => toTimestamp(a.date, a.time) >= now);
      if (!future.length) {
        setUpcomingAppointments([]);
        return;
      }
      future.sort(
        (a, b) => toTimestamp(a.date, a.time) - toTimestamp(b.date, b.time)
      );

      const bizIds = Array.from(
        new Set(future.map((a) => a.business_id).filter(Boolean))
      );
      const bizMap = {};
      await Promise.all(
        bizIds.map(async (id) => {
          try {
            const bizRes = await axios.get(`${API_BASE_URL}/business/${id}`);
            bizMap[id] = bizRes?.data?.business || bizRes?.data;
          } catch {
            /* ignore */
          }
        })
      );

      const mapped = future.map((next) => {
        const biz = next.business_id ? bizMap[next.business_id] : undefined;
        const businessName =
          biz?.full_name || biz?.name || String(next.business_id || "");
        const svc = Array.isArray(biz?.services)
          ? biz.services.find((s) => String(s.id) === String(next.service_id))
          : null;
        const serviceName = svc?.name || String(next.service_id || "");
        const duration = Number(svc?.duration || 0);
        const price = Number(svc?.price || 0);
        const employeeName =
          next?.specialist?.name ||
          (Array.isArray(biz?.staff)
            ? biz.staff.find(
                (s) => String(s.id) === String(next?.specialist?.id)
              )?.name
            : "") ||
          "";
        return {
          id: String(next._id || next.id || ""),
          businessId: String(next.business_id || ""),
          businessName,
          serviceId: String(next.service_id || ""),
          serviceName,
          employeeId: String(next?.specialist?.id || ""),
          employeeName,
          date: next.date,
          time: formatTimeForDisplay(next.time),
          duration,
          price,
          status: mapStatus(next.status),
        };
      });
      setUpcomingAppointments(mapped);
    } catch (e) {
      setApptError(e?.message || "Failed to load appointments");
    } finally {
      setApptLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  // ===== Fetch Businesses =====
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://${BASE_URL}/api/admin/business/all`);
      const allBusinesses = res.data || [];
      const filteredBusinesses = selectedCity
        ? allBusinesses.filter((biz) => {
            const address = String(biz.address || "").toLowerCase();
            const currentCityObj = cities.find((c) => c.id === selectedCity);
            const currentCityName = currentCityObj?.name?.toLowerCase() || "";
            return address.includes(currentCityName);
          })
        : allBusinesses;
      setBusinesses(filteredBusinesses);
    } catch (err) {
      console.error("Failed to fetch businesses", err);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [selectedCity]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchUpcomingAppointments(), fetchBusinesses()]);
    } finally {
      setRefreshing(false);
    }
  };

  // ===== Handlers =====
  const handleCategoryPress = (category) =>
    router.push(`/category/${category.id}`);
  const handleBusinessPress = (business) =>
    router.push(`/business/${business.id}`);
  const handleAppointmentPress = (appointment) =>
    router.push(`/appointment/${appointment.id}`);
  const handlePromotionPress = (promotion) =>
    router.push(
      `/business/${promotion.businessId}?promotionId=${promotion.id}`
    );
  const handleSearch = () => {
    if (searchQuery.trim())
      router.push({ pathname: "/search", params: { query: searchQuery } });
  };
  const handleCityPress = () => setShowCityModal(true);

  // ===== Styles with dynamic darkMode =====
  const styles = getStyles(darkModeEnabled);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View
          style={[
            styles.logoIcon,
            { backgroundColor: darkModeEnabled ? "#1E1E1E" : colors.card },
          ]}
        >
          <Scissors size={24} color={colors.primary} />
        </View>
        <Text style={[styles.appName, { color: colors.primary }]}>
          {t.common.appName}
        </Text>
        <TouchableOpacity
          style={[
            styles.cityButton,
            { backgroundColor: darkModeEnabled ? "#1E1E1E" : colors.card },
          ]}
          onPress={handleCityPress}
        >
          <MapPin size={18} color={colors.primary} />
          <Text style={[styles.cityButtonText, { color: colors.primary }]}>
            {currentCity?.name || t.profile.city}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: darkModeEnabled ? "#2A2A2A" : colors.card,
              color: darkModeEnabled ? "#FFFFFF" : colors.text,
            },
          ]}
          placeholder={t.common.search}
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Search size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoryHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: darkModeEnabled ? "#FFFFFF" : colors.text },
          ]}
        >
          {t.home.categories}
        </Text>
        <TouchableOpacity
          onPress={() => setShowAllCategories(!showAllCategories)}
        >
          <Text style={styles.expandButton}>
            {showAllCategories ? t.common.collapse : t.common.expand}
          </Text>
        </TouchableOpacity>
      </View>
      {showAllCategories ? (
        <View style={styles.categoriesGrid}>
          {categories.map((c) => (
            <CategoryCircle
              key={c.id}
              category={c}
              onPress={handleCategoryPress}
            />
          ))}
        </View>
      ) : (
      <FlatList
  data={categories}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <CategoryCircle 
      category={item} 
      onPress={handleCategoryPress} 
      darkModeEnabled={darkModeEnabled} // Pass dark mode
    />
  )}
  contentContainerStyle={[
    styles.categoriesList,
    { backgroundColor: darkModeEnabled ? '#121212' : '#FFFFFF' }
  ]}
  ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
/>

      )}

      {/* Appointments */}
      {!isGuestMode && (
        <View
          style={[
            styles.section,
            { backgroundColor: darkModeEnabled ? "#121212" : "#FFFFFF" },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: darkModeEnabled ? "#FFFFFF" : colors.text },
              ]}
            >
              {t.home.myAppointments}
            </Text>
          </View>
          {apptLoading ? (
            <Text style={{ color: darkModeEnabled ? "#FFFFFF" : colors.text }}>
              Loading...
            </Text>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appt) => (
              <AppointmentReminder
                key={appt.id}
                appointment={appt}
                onPress={handleAppointmentPress}
                darkModeEnabled={darkModeEnabled}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
            <Text style={[
  styles.emptyStateText,
  { color: darkModeEnabled ? '#FFFFFF' : colors.textSecondary }
]}>
  {t.home.noUpcomingAppointments}
</Text>

            </View>
          )}
        </View>
      )}

      {/* Guest Mode */}
      {isGuestMode && (
        <View
          style={[
            styles.section,
            { backgroundColor: darkModeEnabled ? "#121212" : "#F0F9FF" },
          ]}
        >
          <View style={styles.guestNoticeContainer}>
            <Text
              style={[
                styles.guestNoticeTitle,
                { color: darkModeEnabled ? "#FFFFFF" : colors.primary },
              ]}
            >
              {t.common.welcomeGuestTitle}
            </Text>
            <Text
              style={[
                styles.guestNoticeText,
                { color: darkModeEnabled ? "#CCCCCC" : colors.textSecondary },
              ]}
            >
              {t.common.welcomeGuestText}
            </Text>
            <TouchableOpacity
              style={styles.guestLoginButton}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.guestLoginButtonText}>
                {t.common.loginRegisterCta}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Businesses */}
      <View
        style={[
          styles.section,
          { backgroundColor: darkModeEnabled ? "#121212" : "#FFFFFF" },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: darkModeEnabled ? "#FFFFFF" : colors.text },
            ]}
          >
            {t.home.recommendations}
          </Text>
        </View>
        {loading ? (
          <Text style={{ color: darkModeEnabled ? "#FFFFFF" : colors.text }}>
            Loading...
          </Text>
        ) : businesses.length > 0 ? (
          businesses.map((biz) => (
            <BusinessCard
              key={biz.id}
              business={biz}
              onPress={() => handleBusinessPress(biz)}
              showFavoriteButton
              darkModeEnabled={darkModeEnabled}
            />
          ))
        ) : (
          <Text style={{ color: darkModeEnabled ? "#FFFFFF" : colors.text }}>
            No businesses available
          </Text>
        )}
      </View>

      {/* Promotions */}
      <View
        style={[
          styles.section,
          { backgroundColor: darkModeEnabled ? "#121212" : "#FFFFFF" },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text
            style={[
              styles.sectionTitle,
              { color: darkModeEnabled ? "#FFFFFF" : colors.text },
            ]}
          >
            {t.home.promotions}
          </Text>
          <TouchableOpacity
            onPress={() => setShowAllPromotions(!showAllPromotions)}
          >
            <Text style={styles.viewAll}>
              {showAllPromotions ? t.common.showLess : t.common.viewAll}
            </Text>
          </TouchableOpacity>
        </View>
        {(showAllPromotions
          ? promotions.slice(0, 4)
          : promotions.slice(0, 1)
        ).map((promo) => (
          <PromotionCard
            key={promo.id}
            promotion={promo}
            onPress={handlePromotionPress}
            darkModeEnabled={darkModeEnabled}
          />
        ))}
      </View>

      <CitySelectionModal
        visible={showCityModal}
        onClose={() => setShowCityModal(false)}
      />
    </ScrollView>
  );
}

// ===== Dynamic Styles =====
const getStyles = (darkMode) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: darkMode ? "#121212" : "#FFFFFF" },
    scrollContent: { paddingBottom: 20 },
    logoContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
    },
    logoIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    appName: { fontSize: 22, fontWeight: "700", marginLeft: 12 },
    cityButton: {
      marginLeft: "auto",
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
    },
    cityButtonText: { fontWeight: "600", fontSize: 15, marginLeft: 6 },
    searchContainer: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    searchInput: {
      flex: 1,
      height: 46,
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 16,
    },
    searchButton: {
      width: 46,
      height: 46,
      borderRadius: 8,
      marginLeft: 8,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.primary,
    },
    categoryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      marginTop: 16,
    },
    section: { marginTop: 24, paddingHorizontal: 16 },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: { fontSize: 18, fontWeight: "600" },
    viewAll: { fontSize: 14, color: colors.primary, fontWeight: "500" },
    categoriesList: { paddingHorizontal: 16, paddingVertical: 8 },
    emptyStateContainer: {
      padding: 24,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 8,
      marginBottom: 16,
    },
    emptyStateText: { fontSize: 14, textAlign: "center" },
    expandButton: { fontSize: 14, color: colors.primary, fontWeight: "500" },
    categoriesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: 16,
      paddingVertical: 8,
      justifyContent: "space-between",
    },
    guestNoticeContainer: {
      borderRadius: 12,
      padding: 20,
      borderWidth: 1,
      borderColor: "#BAE6FD",
    },
    guestNoticeTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
    guestNoticeText: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
    guestLoginButton: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignSelf: "flex-start",
    },
    guestLoginButtonText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
    itemSeparator: { width: 16 },
  });
