import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Calendar, Clock, MapPin, AlertCircle, User } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { appointments } from '@/mocks/appointments';
import { getBusinessById } from '@/mocks/businesses';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const appointment = appointments.find(a => a.id === id);
  const business = appointment ? getBusinessById(appointment.businessId) : null;
  
  if (!appointment || !business) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Appointment not found</Text>
      </View>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
      language === 'en' ? 'en-US' : 
      language === 'ru' ? 'ru-RU' : 
      'uz-UZ'
    );
  };
  
  const getStatusColor = (status: string) => {
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
  
  const getLocalizedAddress = () => {
    switch (language) {
      case 'ru':
        return business.addressRu;
      case 'uz':
        return business.addressUz;
      default:
        return business.address;
    }
  };
  
  // Format price to include thousands separators
  const formattedPrice = appointment.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  const handleCancelAppointment = () => {
    Alert.alert(
      t.appointments.cancel,
      'Are you sure you want to cancel this appointment?',
      [
        {
          text: t.common.cancel,
          style: 'cancel',
        },
        {
          text: t.common.confirm,
          onPress: () => {
            setLoading(true);
            // Simulate API call
            setTimeout(() => {
              setLoading(false);
              router.replace('/(tabs)/appointments');
            }, 1000);
          },
        },
      ]
    );
  };
  
  const handleRescheduleAppointment = () => {
    router.push(`/booking/${business.id}?serviceId=${appointment.serviceId}&employeeId=${appointment.employeeId}`);
  };
  
  const canCancel = appointment.status === 'confirmed' || appointment.status === 'pending';
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: t.profile.appointments,
          headerBackTitle: t.common.back,
        }}
      />
      
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: canCancel ? 80 : 20 }
          ]}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.businessName}>{business.name}</Text>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(appointment.status) }
              ]}>
                <Text style={styles.statusText}>
                  {t.appointments.status[appointment.status]}
                </Text>
              </View>
            </View>
            
            <Text style={styles.serviceName}>{appointment.serviceName}</Text>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Calendar size={20} color={colors.primary} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailValue}>{formatDate(appointment.date)}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <Clock size={20} color={colors.primary} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Time</Text>
                  <Text style={styles.detailValue}>{appointment.time}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <User size={20} color={colors.primary} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Employee</Text>
                  <Text style={styles.detailValue}>{appointment.employeeName}</Text>
                </View>
              </View>
              
              <View style={styles.detailItem}>
                <MapPin size={20} color={colors.primary} />
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{getLocalizedAddress()}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>{t.booking.price}</Text>
              <Text style={styles.priceValue}>{formattedPrice} {t.common.sum}</Text>
            </View>
          </View>
          
          {canCancel && (
            <View style={styles.noteContainer}>
              <AlertCircle size={20} color={colors.warning} />
              <Text style={styles.noteText}>
                You can cancel or reschedule up to 24 hours before your appointment.
              </Text>
            </View>
          )}
        </ScrollView>
        
        {canCancel && (
          <View style={styles.footer}>
            <Button
              title={t.appointments.cancel}
              onPress={handleCancelAppointment}
              variant="outline"
              loading={loading}
              style={styles.cancelButton}
            />
            <Button
              title={t.appointments.reschedule}
              onPress={handleRescheduleAppointment}
              style={styles.rescheduleButton}
            />
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20, // Default padding, will be overridden by inline style
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
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
    fontSize: 18,
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
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailTextContainer: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: colors.text,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  priceLabel: {
    fontSize: 16,
    color: colors.text,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.highlight,
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  noteText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      }
    })
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  rescheduleButton: {
    flex: 1,
    marginLeft: 8,
  },
});