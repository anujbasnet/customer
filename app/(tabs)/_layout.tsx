import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Search, Calendar, User } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  const { t } = useTranslation();
  const { darkModeEnabled } = useAppStore();

  const bgColor = darkModeEnabled ? '#1C1C1E' : colors.background;
  const textColor = darkModeEnabled ? '#FFFFFF' : colors.text;
  const borderColor = darkModeEnabled ? '#2C2C2E' : colors.border;
  const inactiveColor = darkModeEnabled ? '#AAAAAA' : colors.textSecondary;
  const activeColor = colors.primary;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopColor: borderColor,
        },
        headerStyle: {
          backgroundColor: bgColor,
        },
        headerTitleStyle: {
          color: textColor,
          fontWeight: '600',
        },
        headerShown: false, // Hide the header for all tab screens
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.home.services,
          tabBarLabel: t.home.services,
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t.search.title,
          tabBarLabel: t.search.title,
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: t.appointments.title,
          tabBarLabel: t.appointments.title,
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.profile.title,
          tabBarLabel: t.profile.title,
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
