import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,

  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  Calendar, 

  HelpCircle, 
  Info, 
  ChevronRight,
  MapPin,

  Globe,
  Bell,
  Moon
} from 'lucide-react-native';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { cities } from '@/mocks/cities';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CitySelector } from '@/components/CitySelector';

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  
  const { user, logout, selectedCity, isAuthenticated } = useAppStore();
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const handleLogout = () => {
    logout();
    router.replace('/(tabs)');
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
  
  const profileMenuItems = [
    {
      icon: <Calendar size={24} color={colors.primary} />,
      title: t.profile.appointments,
      onPress: () => router.push('/appointments'),
    },
    {
      icon: <HelpCircle size={24} color={colors.primary} />,
      title: t.profile.help,
      onPress: () => {},
    },
    {
      icon: <Info size={24} color={colors.primary} />,
      title: t.profile.about,
      onPress: () => {},
    },
  ];

  const settingsItems = [
    {
      icon: <Globe size={24} color={colors.primary} />,
      title: t.profile.language,
      type: 'language',
    },
    {
      icon: <MapPin size={24} color={colors.primary} />,
      title: t.profile.city,
      type: 'city',
    },
    {
      icon: <Bell size={24} color={colors.primary} />,
      title: t.profile.notifications,
      type: 'switch',
      value: notificationsEnabled,
      onValueChange: setNotificationsEnabled,
    },
    {
      icon: <Moon size={24} color={colors.primary} />,
      title: 'Dark Mode',
      type: 'switch',
      value: darkModeEnabled,
      onValueChange: setDarkModeEnabled,
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
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
      case 'city':
        return (
          <View key={index} style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              {item.icon}
              <Text style={styles.menuItemTitle}>{item.title}</Text>
            </View>
            <CitySelector />
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
      {/* Tab Selector */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'profile' && styles.activeTab]}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'profile' && styles.activeTabText
            ]}
          >
            {t.profile.title}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'settings' && styles.activeTabText
            ]}
          >
            {t.profile.settings}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {activeTab === 'profile' ? (
          <>
            <View style={styles.header}>
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
              <Text style={styles.name}>{user?.name || 'User'}</Text>
              <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
              
              <View style={styles.cityContainer}>
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={styles.cityText}>{getCurrentCityName()}</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setActiveTab('settings')}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>{t.profile.editProfile}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuContainer}>
              {profileMenuItems.map((item, index) => (
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
              ))}
            </View>
          </>
        ) : (
          <View style={styles.settingsContainer}>
            <View style={styles.settingsSection}>
              <Text style={styles.sectionTitle}>{t.profile.settings}</Text>
              <View style={styles.sectionContent}>
                {settingsItems.map((item, index) => renderSettingItem(item, index))}
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.logoutContainer}>
          <Button
            title={t.auth.logout}
            onPress={handleLogout}
            variant="outline"
          />
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
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
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
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cityText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  editButtonText: {
    fontSize: 14,
    color: colors.primary,
  },
  menuContainer: {
    marginTop: 16,
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
  settingsContainer: {
    flex: 1,
  },
  settingsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  sectionContent: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  logoutContainer: {
    padding: 24,
    marginTop: 16,
    marginBottom: 24,
  },
});