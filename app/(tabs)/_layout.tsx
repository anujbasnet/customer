import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Home, Search, Calendar, Settings } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5C6BC0',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: Platform.OS === 'web' ? '#FFFFFF' : '#FFFFFF',
          borderTopColor: Platform.OS === 'web' ? '#E0E0E0' : '#E0E0E0',
          borderTopWidth: Platform.OS === 'web' ? 1 : 0.5,
          height: Platform.OS === 'ios' ? 80 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: t.home,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: t.search || 'Search',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          tabBarLabel: t.appointments || 'Appointments',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: t.settings || 'Settings',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
