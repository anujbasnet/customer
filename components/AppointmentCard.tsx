import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Platform
} from 'react-native';
import { Calendar, Clock, User } from 'lucide-react-native';
import { Appointment } from '@/types';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onPress 
}) => {
  const { t, language } = useTranslation();
  const { darkModeEnabled } = useAppStore();

   const bgColor = darkModeEnabled ? "#1E1E1E" : colors.card;
   const textColor = darkModeEnabled ? "#FFFFFF" : colors.text;
   const secondaryTextColor = darkModeEnabled ? "#B0B0B0" : colors.textSecondary;
   const borderColor = darkModeEnabled ? "#2A2A2A" : colors.border;

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'completed':
        return colors.primary;
      case 'cancelled':
        return colors.error;
      default:
        return secondaryTextColor;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === 'en' ? 'en-US' : 
      language === 'ru' ? 'ru-RU' : 
      'uz-UZ'
    );
  };
  
  const formattedPrice = appointment.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: bgColor, borderColor }]}
      onPress={() => onPress(appointment)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.businessName, { color: textColor }]}>{appointment.businessName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>
            {t.appointments.status[appointment.status]}
          </Text>
        </View>
      </View>
      
      <Text style={[styles.serviceName, { color: secondaryTextColor }]}>{appointment.serviceName}</Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detail}>
          <Calendar size={16} color={secondaryTextColor} />
          <Text style={[styles.detailText, { color: secondaryTextColor }]}>{formatDate(appointment.date)}</Text>
        </View>
        <View style={styles.detail}>
          <Clock size={16} color={secondaryTextColor} />
          <Text style={[styles.detailText, { color: secondaryTextColor }]}>{appointment.time}</Text>
        </View>
        <View style={styles.detail}>
          <User size={16} color={secondaryTextColor} />
          <Text style={[styles.detailText, { color: secondaryTextColor }]}>{appointment.employeeName}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.price, { color: colors.primary }]}>{formattedPrice} {t.common.sum}</Text>
        <Text style={[styles.duration, { color: secondaryTextColor }]}>{appointment.duration} {t.booking.minutes}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    })
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  serviceName: {
    fontSize: 14,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  duration: {
    fontSize: 14,
  },
});
