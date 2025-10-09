import React, { useEffect, useState } from 'react';
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
import { Calendar, Clock, MapPin, User } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<any | null>(null);
  const [business, setBusiness] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { t, language } = useTranslation();
  const router = useRouter();
  
  const API_BASE_URL = 'http://192.168.1.5:5000/api';

  const parseTimeLabel = (label: string) => {
    if (!label) return { h: 0, m: 0 };
    const s = String(label).trim().toLowerCase();
    const am = s.includes('am');
    const pm = s.includes('pm');
    const match = s.match(/(\d{1,2}):(\d{2})/);
    let h = 0, m = 0;
    if (match) {
      h = parseInt(match[1], 10);
      m = parseInt(match[2], 10);
      if (pm && h < 12) h += 12;
      if (am && h === 12) h = 0;
    }
    return { h, m };
  };
  const toTimestamp = (dateStr?: string, timeLabel?: string) => {
    if (!dateStr) return 0;
    const [y, mo, d] = String(dateStr).split('-').map(v => parseInt(v, 10));
    const { h, m } = parseTimeLabel(timeLabel || '');
    return new Date(y, (mo || 1) - 1, d || 1, h, m, 0, 0).getTime();
  };

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true); setError(null);
      try {
        const token = await AsyncStorage.getItem('token');
        // Fetch all appointments for user and find this one by id
        const { data } = await axios.get(`${API_BASE_URL}/appointments`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const list = (data?.appointments || data || []).filter(Boolean);
        const found = list.find((a: any) => String(a._id || a.id) === String(id));
        if (!found) throw new Error('Appointment not found');
        const normalized = {
          // Prefer public id used by backend for updates; fallback to Mongo _id only if needed
          id: String(found.id || found._id || ''),
          businessId: String(found.business_id || ''),
          serviceId: String(found.service_id || ''),
          employeeId: String(found?.specialist?.id || ''),
          employeeName: found?.specialist?.name || '',
          date: found.date,
          time: found.time,
          status: String(found.status || ''),
        };
        let biz: any = null;
        if (normalized.businessId) {
          try {
            const bizRes = await axios.get(`${API_BASE_URL}/business/${normalized.businessId}`);
            biz = bizRes?.data?.business || bizRes?.data || null;
          } catch {}
        }
        if (!active) return;
        setAppointment(normalized);
        setBusiness(biz);
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || 'Failed to load appointment');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [id]);
  
  if (loading) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Loading...</Text>
      </View>
    );
  }

  if (!appointment || !business) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>{error || 'Appointment not found'}</Text>
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
  // Find service details for price/duration/name (no hooks to avoid order issues)
  const service = business?.services
    ? business.services.find((s: any) => String(s.id) === String(appointment.serviceId))
    : null;
  const formattedPrice = service?.price ? String(service.price).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '0';
  
  const handleCancelAppointment = () => {
    Alert.alert(
      t.appointments.cancel,
      'Are you sure you want to cancel this appointment?',
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.confirm,
          onPress: async () => {
            try {
              // Safety guard: do not cancel if status is already 'booked'
              if (String(appointment.status).toLowerCase() === 'booked') {
                Alert.alert('Not allowed', 'This appointment has been confirmed and cannot be cancelled.');
                return;
              }
              setLoading(true);
              const token = await AsyncStorage.getItem('token');
              await axios.patch(
                `${API_BASE_URL}/appointments/${appointment.id}/status`,
                // Backend expects American spelling 'canceled'
                { status: 'canceled' },
                { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
              );
              // Update local state to reflect cancelled status immediately
              setAppointment((prev: any) => prev ? { ...prev, status: 'canceled' } : prev);
            } catch (e: any) {
              const msg = e?.response?.data?.msg || e?.message || 'Failed to cancel appointment. Please try again.';
              Alert.alert('Error', String(msg));
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  
  const handleRescheduleAppointment = () => {
    router.push(`/booking/${business.id}?serviceId=${appointment.serviceId}&employeeId=${appointment.employeeId}`);
  };
  
  // Allow cancelling only when status is not 'booked' and not already canceled/completed
  const rawStatus = String(appointment.status).toLowerCase();
  const canCancel = rawStatus !== 'booked' && !rawStatus.startsWith('cancel') && rawStatus !== 'completed';
  
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
                { backgroundColor: getStatusColor(
                  (String(appointment.status).toLowerCase() === 'booked') ? 'confirmed'
                    : (String(appointment.status).toLowerCase() === 'waiting') ? 'pending'
                    : (String(appointment.status).toLowerCase().startsWith('cancel')) ? 'cancelled'
                    : (String(appointment.status).toLowerCase() === 'canceled') ? 'cancelled'
                    : (String(appointment.status).toLowerCase() === 'completed') ? 'completed'
                    : 'pending'
                ) }
              ]}>
                <Text style={styles.statusText}>
                  {t.appointments.status[
                    (String(appointment.status).toLowerCase() === 'booked') ? 'confirmed'
                      : (String(appointment.status).toLowerCase() === 'waiting') ? 'pending'
                      : (String(appointment.status).toLowerCase().startsWith('cancel')) ? 'cancelled'
                      : (String(appointment.status).toLowerCase() === 'canceled') ? 'cancelled'
                      : (String(appointment.status).toLowerCase() === 'completed') ? 'completed'
                      : 'pending'
                  ]}
                </Text>
              </View>
            </View>
            
            <Text style={styles.serviceName}>{service?.name || appointment.serviceId}</Text>
            
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
          
          {/* note removed per request */}
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