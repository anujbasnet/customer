import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import {
  User,
  Edit3,
  Settings,
  HelpCircle,
  Info,
  ChevronRight,
  MapPin,
  Phone,
  Globe,
  Star,
  LogOut,
} from "lucide-react-native";
import axios from "axios";
import { useAppStore } from "@/hooks/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { colors } from "@/constants/colors";
import { Button } from "@/components/Button";
import { cities } from "@/mocks/cities";
import { LanguageSelector } from "@/components/LanguageSelector";

const API_URL = "http://192.168.1.3:5000/api/auth";

export default function ProfileScreen() {
  const { isGuestMode, logout } = useAppStore();
  const { t, language } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load user from token
  const loadUser = async () => {
  const token = await AsyncStorage.getItem("token");
  const storedUser = await AsyncStorage.getItem("user");

  if (token && storedUser) {
    setUser(JSON.parse(storedUser));
    setIsAuthenticated(true);
  } else if (token) {
    // fallback to API call
    try {
      const res = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (err) {
      console.log("Invalid token, logging out", err);
      await AsyncStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    }
  } else {
    setUser(null);
    setIsAuthenticated(false);
  }
};


  // Reload user every time screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUser();
    }, [])
  );

  const handleLogin = () => router.push("/(auth)/login");
  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = async () => {
    await AsyncStorage.removeItem("token");
    logout();
    setUser(null);
    setIsAuthenticated(false);
    setShowLogoutModal(false);
    router.replace("/(auth)/login");
  };

  const getCurrentCityName = () => {
    if (!user) return "";
    const currentCity = cities.find((c) => c.id === user.selectedCity);
    if (!currentCity) return "";
    switch (language) {
      case "ru":
        return currentCity.nameRu;
      case "uz":
        return currentCity.nameUz;
      default:
        return currentCity.name;
    }
  };

  const menuItems = [
    !isAuthenticated && !isGuestMode
      ? {
          icon: <User size={24} color={colors.primary} />,
          title: t.profile.loginRegisterPrompt,
          onPress: handleLogin,
        }
      : null,
    isAuthenticated && !isGuestMode
      ? {
          icon: <Edit3 size={24} color={colors.primary} />,
          title: t.profile.editProfile,
          onPress: () => router.push("/edit-profile"),
        }
      : null,
    {
      icon: <Settings size={24} color={colors.primary} />,
      title: t.profile.settings,
      onPress: () => router.push("/setting"),
    },
    {
      icon: <Globe size={24} color={colors.primary} />,
      title: t.profile.language,
      type: "language",
    },
    {
      icon: <Star size={24} color={colors.primary} />,
      title: t.profile.myReviews,
      onPress: () => router.push("/my-reviews"),
    },
    {
      icon: <HelpCircle size={24} color={colors.primary} />,
      title: t.profile.help,
      onPress: () => router.push("/help-support"),
    },
    {
      icon: <Info size={24} color={colors.primary} />,
      title: t.profile.about,
      onPress: () => router.push("/about"),
    },
    isGuestMode
      ? {
          icon: <LogOut size={24} color={colors.error} />,
          title: t.profile.exitGuestMode,
          onPress: handleLogout,
          variant: "danger",
        }
      : isAuthenticated
      ? {
          icon: <LogOut size={24} color={colors.error} />,
          title: t.auth.logout,
          onPress: handleLogout,
          variant: "danger",
        }
      : null,
  ].filter(Boolean);

  const renderMenuItem = (item, index) => {
    const titleStyle = [
      styles.menuItemTitle,
      item.variant === "danger" ? { color: colors.error } : null,
    ];

    if (item.type === "language") {
      return (
        <View key={index} style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            {item.icon}
            <Text style={titleStyle}>{item.title}</Text>
          </View>
          <LanguageSelector />
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={styles.menuItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          {item.icon}
          <Text style={titleStyle}>{item.title}</Text>
        </View>
        <ChevronRight size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    );
  };

  if (!isAuthenticated && !isGuestMode) {
    return (
      <View style={[styles.notAuthContainer, { paddingTop: insets.top }]}>
        <View style={styles.largeAvatarPlaceholder}>
          <User size={56} color="#FFFFFF" />
        </View>
        <Text style={styles.notAuthTitle}>{t.auth.noAccount}</Text>
        <Text style={styles.notAuthText}>{t.profile.loginToAccess}</Text>
        <Button
          title={t.auth.login}
          onPress={handleLogin}
          style={styles.loginButton}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionCard}>
          <View style={styles.profileHeader}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatarLarge} />
            ) : (
              <View style={styles.avatarDecorWrap}>
                <View style={styles.avatarRing} />
                <View style={styles.avatarLargePlaceholder}>
                  <User size={64} color="#FFFFFF" />
                </View>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.nameLarge} numberOfLines={1}>
                {isGuestMode
                  ? t.profile.guestUser
                  : user?.name ?? t.profile.defaultUser}
              </Text>
              {!isGuestMode && (
                <>
                  <View style={styles.contactRowLg}>
                    <Phone size={18} color={colors.primary} />
                    <Text style={styles.contactTextLg}>
                      {user?.phone ?? ""}
                    </Text>
                  </View>
                  <View style={styles.contactRowLg}>
                    <MapPin size={18} color={colors.primary} />
                    <Text style={styles.contactTextLg}>
                      {getCurrentCityName()}
                    </Text>
                  </View>
                </>
              )}
              {isGuestMode && (
                <Text style={styles.guestModeText}>
                  {t.profile.guestModeText}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.itemDividerFull} />

          {menuItems.map((item, index) => (
            <View key={index}>
              {renderMenuItem(item, index)}
              {index < menuItems.length - 1 && (
                <View style={styles.itemDivider} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isGuestMode ? t.profile.exitGuestMode : t.profile.confirmLogout}
            </Text>
            <Text style={styles.modalMessage}>
              {isGuestMode
                ? t.profile.exitGuestModeConfirm
                : t.profile.logoutConfirm}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>{t.common.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmButtonText}>{t.common.confirm}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContainer: { flex: 1 },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 12,
  },
  avatarLarge: { width: 88, height: 88, borderRadius: 44 },
  avatarDecorWrap: {
    width: 88,
    height: 88,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarRing: {
    position: "absolute",
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "rgba(59,130,246,0.12)",
  },
  avatarLargePlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: { flex: 1, marginLeft: 16 },
  nameLarge: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    textAlign: "left",
  },
  contactRowLg: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  contactTextLg: { fontSize: 15, color: colors.textSecondary, marginLeft: 6 },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 1 },
      default: {},
    }),
  },
  itemDivider: { height: 1, backgroundColor: colors.border, marginLeft: 52 },
  itemDividerFull: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: -12,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 10,
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  menuItemTitle: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
    fontWeight: "500",
  },
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
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
  },
  loginButton: { width: "100%", maxWidth: 300 },
  largeAvatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: { flexDirection: "row", width: "100%" },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
  },
  confirmButton: { backgroundColor: colors.error, marginLeft: 10 },
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: colors.text },
  confirmButtonText: { fontSize: 16, fontWeight: "600", color: "#FFFFFF" },
  guestModeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
    marginTop: 4,
  },
});
