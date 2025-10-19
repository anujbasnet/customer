import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { ArrowLeft, MapPin, Filter } from "lucide-react-native";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";
import { businesses } from "@/mocks/businesses";
import { categories } from "@/mocks/categories";
import { cities } from "@/mocks/cities";
import { Business } from "@/types";

const { width, height } = Dimensions.get("window");

export default function MapScreen() {
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);

  const { t, language } = useTranslation();
  const router = useRouter();
  const { selectedCity, darkModeEnabled } = useAppStore();

  const colors = {
    background: darkModeEnabled ? "#121212" : "#FFFFFF",
    card: darkModeEnabled ? "#1E1E1E" : "#FFFFFF",
    text: darkModeEnabled ? "#FFFFFF" : "#000000",
    textSecondary: darkModeEnabled ? "#AAAAAA" : "#6B7280",
    border: darkModeEnabled ? "#333333" : "#E5E7EB",
    primary: "#3B82F6",
  };

  useEffect(() => {
    let results = [...businesses];
    if (selectedCity) {
      results = results.filter((business) => business.cityId === selectedCity);
    }
    if (params.categoryId && params.categoryId !== "all") {
      const category = categories.find((c) => c.id === params.categoryId);
      if (category)
        results = results.filter((b) => b.category === category.name);
    }
    setFilteredBusinesses(results);
  }, [params.categoryId, selectedCity]);

  const handleBusinessPress = (business: Business) => {
    router.push(`/business/${business.id}`);
  };

  const selectedCityName = selectedCity
    ? cities.find((c) => c.id === selectedCity)?.[
        language === "ru" ? "nameRu" : language === "uz" ? "nameUz" : "name"
      ] || "City"
    : "Select City";

  const categoryName =
    params.categoryId && params.categoryId !== "all"
      ? categories.find((c) => c.id === params.categoryId)?.name || "All"
      : "All";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: "Maps",
           headerStyle: {
                  backgroundColor: darkModeEnabled ? "#121212" : "#FFFFFF",
                },
                headerTintColor: darkModeEnabled ? "#FFFFFF" : "#000000",
                headerTitleStyle: { fontWeight: "600" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                Alert.alert("Filter", "Filter options coming soon")
              }
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <Filter size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <View
        style={[
          styles.infoContainer,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <View style={styles.locationInfo}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={[styles.locationText, { color: colors.textSecondary }]}>
            {selectedCityName}
          </Text>
        </View>
        <Text style={[styles.categoryText, { color: colors.text }]}>
          {categoryName === "All" ? "All Services" : categoryName}
        </Text>
        <Text style={[styles.countText, { color: colors.textSecondary }]}>
          {filteredBusinesses.length}{" "}
          {filteredBusinesses.length === 1 ? "location" : "locations"} found
        </Text>
      </View>

      <View style={styles.mapContainer}>
        <View
          style={[
            styles.mapPlaceholder,
            { backgroundColor: darkModeEnabled ? "#1E1E1E" : "#f0f0f0" },
          ]}
        >
          <MapPin size={48} color={colors.primary} />
          <Text style={[styles.mapPlaceholderText, { color: colors.text }]}>
            Interactive Map
          </Text>
          <Text style={[styles.mapSubText, { color: colors.textSecondary }]}>
            Google Maps integration coming soon
          </Text>
        </View>

        {filteredBusinesses.slice(0, 5).map((business, index) => (
          <TouchableOpacity
            key={business.id}
            style={[
              styles.mapPin,
              { left: 50 + index * 60, top: 150 + index * 40 },
            ]}
            onPress={() => setSelectedBusiness(business)}
            activeOpacity={0.8}
          >
            <View
              style={[styles.pinContainer, { backgroundColor: colors.primary }]}
            >
              <MapPin size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedBusiness && (
        <View
          style={[
            styles.businessCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.businessInfo}>
            <Text
              style={[styles.businessName, { color: colors.text }]}
              numberOfLines={1}
            >
              {selectedBusiness.name}
            </Text>
            <Text
              style={[styles.businessCategory, { color: colors.primary }]}
              numberOfLines={1}
            >
              {
                t.categories[
                  selectedBusiness.category as keyof typeof t.categories
                ]
              }
            </Text>
            <Text
              style={[styles.businessAddress, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {language === "ru"
                ? selectedBusiness.addressRu
                : language === "uz"
                ? selectedBusiness.addressUz
                : selectedBusiness.address}
            </Text>
            <View style={styles.businessRating}>
              <Text style={[styles.ratingText, { color: colors.text }]}>
                ⭐ {selectedBusiness.rating}
              </Text>
              <Text
                style={[styles.reviewCount, { color: colors.textSecondary }]}
              >
                ({selectedBusiness.reviewCount} reviews)
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.viewButton, { backgroundColor: colors.primary }]}
            onPress={() => handleBusinessPress(selectedBusiness)}
            activeOpacity={0.8}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerButton: { padding: 8 },
  infoContainer: { padding: 16, borderBottomWidth: 1 },
  locationInfo: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  locationText: { fontSize: 14, marginLeft: 4 },
  categoryText: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  countText: { fontSize: 14 },
  mapContainer: { flex: 1, position: "relative" },
  mapPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  mapPlaceholderText: { fontSize: 20, fontWeight: "600", marginTop: 12 },
  mapSubText: { fontSize: 14, marginTop: 4 },
  mapPin: { position: "absolute", zIndex: 10 },
  pinContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      android: { elevation: 3 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      },
    }),
  },
  businessCard: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    ...Platform.select({
      android: { elevation: 5 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
    }),
  },
  businessInfo: { flex: 1, marginRight: 12 },
  businessName: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  businessCategory: { fontSize: 14, marginBottom: 2 },
  businessAddress: { fontSize: 12, marginBottom: 4 },
  businessRating: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 12, marginRight: 4 },
  reviewCount: { fontSize: 12 },
  viewButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  viewButtonText: { fontSize: 14, fontWeight: "500", color: "#FFFFFF" },
});
