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

interface AppointmentCardProps {
  appointment: Appointment;
  onPress: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onPress 
}) => {
  const { t, language } = useTranslation();
  
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
        return colors.textSecondary;
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
  
  // Format price to include thousands separators
  const formattedPrice = appointment.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(appointment)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.businessName}>{appointment.businessName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>
            {t.appointments.status[appointment.status]}
          </Text>
        </View>
      </View>
      
      <Text style={styles.serviceName}>{appointment.serviceName}</Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.detail}>
          <Calendar size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{formatDate(appointment.date)}</Text>
        </View>
        <View style={styles.detail}>
          <Clock size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{appointment.time}</Text>
        </View>
        <View style={styles.detail}>
          <User size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{appointment.employeeName}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.price}>{formattedPrice} {t.common.sum}</Text>
        <Text style={styles.duration}>{appointment.duration} {t.booking.minutes}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
    color: colors.text,
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
    color: colors.textSecondary,
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
    color: colors.textSecondary,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  duration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});