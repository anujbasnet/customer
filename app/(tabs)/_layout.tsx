import React from 'react';
import { Tabs } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { Home, Search, Calendar, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5C9EA6',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          backgroundColor: Platform.OS === 'web' ? '#f8f8f8' : '#fff',
          borderTopWidth: Platform.OS === 'web' ? 0 : 1,
          borderTopColor: '#eee',
          height: Platform.OS === 'web' ? 60 : 80,
          paddingBottom: Platform.OS === 'web' ? 0 : 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home.title'),
          tabBarLabel: t('home.title'),
          tabBarIcon: ({ color, size, focused }) => (
            <Home color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('search.title'),
          tabBarLabel: t('search.title'),
          tabBarIcon: ({ color, size, focused }) => (
            <Search color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: t('appointments.title'),
          tabBarLabel: t('appointments.title'),
          tabBarIcon: ({ color, size, focused }) => (
            <Calendar color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          tabBarLabel: t('settings.title'),
          tabBarIcon: ({ color, size, focused }) => (
            <Settings color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tabs>
  );
}
