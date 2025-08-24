import React, { useMemo, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Alert,
  Switch
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
  Bell,
  LogOut
} from 'lucide-react-native';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { cities } from '@/mocks/cities';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function ProfileScreen() {
  const { user, logout, selectedCity, isAuthenticated } = useAppStore();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(tabs)');
          }
        }
      ]
    );
  };

  const handleLogin = () => {
    router.push('/(auth)');
  };
  
  const getCurrentCityName = () => {
    const currentCity = cities.find(c => c.id === selectedCity);
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
  
  const menuItems = useMemo(() => [
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
    {
      icon: <Globe size={24} color={colors.primary} />,
      title: t.profile.language,
      type: 'language',
    },
    {
      icon: <Star size={24} color={colors.primary} />,
      title: 'My Reviews',
      onPress: () => {},
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
  ], [router, t]);

  const renderMenuItem = (item: any, index: number) => {
    switch (item.type) {
      case 'language':
        return (
          <View key={index} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </View>
            <LanguageSelector />
          </View>
        );
      case 'switch':
        return (
          <View key={index} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        );
      default:
        return (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </View>
            <ChevronRight size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        );
    }
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <View style={styles.notAuthContainer}>
        <View style={styles.avatarPlaceholder}>
          <User size={40} color="#FFFFFF" />
        </View>
        <Text style={styles.notAuthTitle}>{t.auth.noAccount}</Text>
        <Text style={styles.notAuthText}>
          Please login or register to view your profile and appointments
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
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color="#FFFFFF" />
              </View>
            )}
            
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{user?.name || 'User'}</Text>
              <View style={styles.contactRow}>
                <Phone size={14} color={colors.textSecondary} />
                <Text style={styles.contactText}>{user?.phone || '+1 234 567 8900'}</Text>
              </View>
              <View style={styles.contactRow}>
                <MapPin size={14} color={colors.textSecondary} />
                <Text style={styles.contactText}>{getCurrentCityName()}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
            testID="logout-button"
          >
            <LogOut size={24} color={colors.error} />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  scrollContainer: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  menuContainer: {
    marginTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
  },
  logoutContainer: {
    padding: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FED7D7',
  },
  logoutText: {
    fontSize: 15,
    color: colors.error,
    marginLeft: 8,
    fontWeight: '500',
  },
});
