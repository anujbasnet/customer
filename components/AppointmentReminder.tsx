import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Calendar, Clock } from 'lucide-react-native';
import { Appointment } from '@/types';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

interface AppointmentReminderProps {
  appointment: Appointment;
  onPress: (appointment: Appointment) => void;
}

export const AppointmentReminder: React.FC<AppointmentReminderProps> = ({ appointment, onPress }) => {
  const { t } = useTranslation();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(appointment)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.businessInfo}>
          <Text style={styles.businessName}>{appointment.businessName}</Text>
          <Text style={styles.serviceName}>{appointment.serviceName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>
            {t.appointments.status[appointment.status as keyof typeof t.appointments.status]}
          </Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{formatDate(appointment.date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{appointment.time} ({appointment.duration} {t.booking.minutes})</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.employeeName}>{appointment.employeeName}</Text>
        <Text style={styles.price}>{appointment.price.toLocaleString()} {t.common.sum}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  businessInfo: {
    flex: 1,
    marginRight: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  employeeName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});