import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
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
} from 'lucide-react-native';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { cities } from '@/mocks/cities';
import { LanguageSelector } from '@/components/LanguageSelector';

interface BaseMenuItem {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  type?: 'language' | 'switch' | 'default';
  value?: boolean;
  onValueChange?: (v: boolean) => void;
  variant?: 'default' | 'danger';
}

export default function ProfileScreen() {
  const { user, logout, selectedCity, isAuthenticated, isGuestMode } = useAppStore();
  const { t, language } = useTranslation();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const handleLogout = () => {
    console.log('[Profile] Logout pressed');
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    console.log('[Profile] Logout confirmed');
    logout();
    setShowLogoutModal(false);
    router.replace('/(auth)/login');
  };

  const handleLogin = () => {
    console.log('[Profile] Navigate to auth');
    router.push('/(auth)');
  };

  const getCurrentCityName = () => {
    const currentCity = cities.find((c) => c.id === selectedCity);
    if (!currentCity) return '';

    switch (language) {
      case 'ru':
        return currentCity.nameRu;
      case 'uz':
        return currentCity.nameUz;
      default:
        return currentCity.name;
    }
  };

  const menuItems: BaseMenuItem[] = useMemo(() => {
    const baseItems: BaseMenuItem[] = [
      {
        icon: <Globe size={24} color={colors.primary} />,
        title: t.profile.language,
        type: 'language',
      },
      {
        icon: <HelpCircle size={24} color={colors.primary} />,
        title: 'Help & Support',
        onPress: () => router.push('/help-support'),
      },
      {
        icon: <Info size={24} color={colors.primary} />,
        title: 'About',
        onPress: () => router.push('/about'),
      },
      {
        icon: <Info size={24} color={colors.primary} />,
        title: 'Try Rejaly Business App',
        onPress: () => router.push('/business-app-info'),
      },
    ];

    if (isGuestMode) {
      return [
        {
          icon: <User size={24} color={colors.primary} />,
          title: 'Login / Register',
          onPress: () => router.push('/(auth)'),
        },
        ...baseItems,
        {
          icon: <LogOut size={24} color={colors.error} />,
          title: 'Exit Guest Mode',
          onPress: () => handleLogout(),
          variant: 'danger',
        },
      ];
    }

    return [
      {
        icon: <Edit3 size={24} color={colors.primary} />,
        title: 'Edit profile',
        onPress: () => router.push('/edit-profile'),
      },
      {
        icon: <Settings size={24} color={colors.primary} />,
        title: 'Settings',
        onPress: () => router.push('/settings'),
      },
      ...baseItems,
      {
        icon: <Star size={24} color={colors.primary} />,
        title: 'My Reviews',
        onPress: () => router.push('/my-reviews'),
      },
      {
        icon: <LogOut size={24} color={colors.error} />,
        title: 'Log out',
        onPress: () => handleLogout(),
        variant: 'danger',
      },
    ];
  }, [router, t, isGuestMode]);

  const renderMenuItem = (item: BaseMenuItem, index: number) => {
    const titleStyle = [
      styles.menuItemTitle,
      item.variant === 'danger' ? { color: colors.error } : null,
    ];

    switch (item.type) {
      case 'language':
        return (
          <View key={`menu-${index}`} style={styles.menuItem} testID={`menu-language`}>
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={titleStyle as any}>{item.title}</Text>
            </View>
            <LanguageSelector />
          </View>
        );
      case 'switch':
        return (
          <View key={`menu-${index}`} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={titleStyle as any}>{item.title}</Text>
            </View>
            <Switch
              value={item.value ?? false}
              onValueChange={item.onValueChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        );
      default:
        return (
          <TouchableOpacity
            key={`menu-${index}`}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
            testID={`menu-${index}`}
          >
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={titleStyle as any}>{item.title}</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        );
    }
  };

  if (!isAuthenticated && !isGuestMode) {
    return (
      <View style={styles.notAuthContainer}>
        <View style={styles.largeAvatarPlaceholder}>
          <User size={56} color="#FFFFFF" />
        </View>
        <Text style={styles.notAuthTitle}>{t.auth.noAccount}</Text>
        <Text style={styles.notAuthText}>
          Please login or register to view your profile and appointments
        </Text>
        <Button title={t.auth.login} onPress={handleLogin} style={styles.loginButton} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} scrollEventThrottle={16}>
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
            <Text style={styles.nameLarge} numberOfLines={1}>
              {isGuestMode ? 'Guest User' : user?.name ?? 'User'}
            </Text>
            {!isGuestMode && (
              <>
                <View style={styles.contactRowLgCenter}>
                  <Phone size={18} color={colors.primary} />
                  <Text style={styles.contactTextLg}>{user?.phone ?? ''}</Text>
                </View>
                <View style={styles.contactRowLgCenter}>
                  <MapPin size={18} color={colors.primary} />
                  <Text style={styles.contactTextLg}>{getCurrentCityName()}</Text>
                </View>
              </>
            )}
            {isGuestMode && (
              <Text style={styles.guestModeText}>
                You&apos;re browsing in guest mode. Login to access all features.
              </Text>
            )}
          </View>

          <View style={styles.itemDividerFull} />

          {menuItems.map((item, index) => (
            <View key={`wrap-${index}`}>
              {renderMenuItem(item, index)}
              {index < menuItems.length - 1 && <View style={styles.itemDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isGuestMode ? 'Exit Guest Mode' : 'Confirm Logout'}</Text>
            <Text style={styles.modalMessage}>
              {isGuestMode ? 'Are you sure you want to exit guest mode?' : 'Are you sure you want to log out?'}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowLogoutModal(false)} testID="cancel-logout">
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={confirmLogout} testID="confirm-logout">
                <Text style={styles.confirmButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 8,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  avatarDecorWrap: {
    width: 96,
    height: 96,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRing: {
    position: 'absolute',
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: 'rgba(59,130,246,0.12)',
  },
  avatarLargePlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  contactRowLg: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  contactRowLgCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  contactTextLg: {
    fontSize: 15,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
      default: {},
    }),
  },
  itemDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 56,
  },
  itemDividerFull: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: -12,
    marginBottom: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
    fontWeight: '500',
  },
  notAuthContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notAuthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  notAuthText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    maxWidth: 300,
  },
  largeAvatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: colors.error,
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  guestModeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
});
