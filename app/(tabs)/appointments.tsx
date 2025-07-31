import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList,
  TouchableOpacity,

} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';
import { AppointmentCard } from '@/components/AppointmentCard';
import { Button } from '@/components/Button';
import { getUpcomingAppointments, getPastAppointments } from '@/mocks/appointments';
import { Appointment } from '@/types';

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = useAppStore();
  
  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();
  
  const appointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;
  
  const handleAppointmentPress = (appointment: Appointment) => {
    router.push(`/appointment/${appointment.id}`);
  };

  const handleLogin = () => {
    router.push('/(auth)');
  };

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <View style={styles.notAuthContainer}>
        <Text style={styles.notAuthTitle}>{t.appointments.noAppointments}</Text>
        <Text style={styles.notAuthText}>
          Please login or register to view and manage your appointments
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
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'upcoming' && styles.activeTabText
            ]}
          >
            {t.profile.upcoming}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.tabText, 
              activeTab === 'past' && styles.activeTabText
            ]}
          >
            {t.profile.past}
          </Text>
        </TouchableOpacity>
      </View>
      
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AppointmentCard
              appointment={item}
              onPress={handleAppointmentPress}
            />
          )}
          contentContainerStyle={styles.appointmentsList}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t.appointments.noAppointments}</Text>
        </View>
      )}
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
  appointmentsList: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});