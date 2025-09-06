import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { CheckCircle, Calendar, Clock, User, MapPin, DollarSign } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function BookingConfirmedScreen() {
  const params = useLocalSearchParams<{
    businessName: string;
    serviceName: string;
    date: string;
    time: string;
    employeeName: string;
    price: string;
    originalPrice?: string;
    discountAmount?: string;
    discountPercent?: string;
    promotionText?: string;
  }>();
  
  const router = useRouter();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formattedPrice = params.price?.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Booking Confirmed',
          headerBackTitle: 'Back',
          headerLeft: () => null, // Remove back button
        }}
      />
      
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Icon */}
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <CheckCircle size={64} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>Booking Confirmed!</Text>
            <Text style={styles.successSubtitle}>
              Your appointment has been successfully booked
            </Text>
          </View>
          
          {/* Booking Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Appointment Details</Text>
            
            <View style={styles.detailItem}>
              <MapPin size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Business</Text>
                <Text style={styles.detailValue}>{params.businessName}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <User size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Service</Text>
                <Text style={styles.detailValue}>{params.serviceName}</Text>
              </View>
            </View>
            
            {params.employeeName && (
              <View style={styles.detailItem}>
                <User size={20} color={colors.primary} />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Employee</Text>
                  <Text style={styles.detailValue}>{params.employeeName}</Text>
                </View>
              </View>
            )}
            
            <View style={styles.detailItem}>
              <Calendar size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formatDate(params.date || '')}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <Clock size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{params.time}</Text>
              </View>
            </View>
            
            <View style={styles.detailItem}>
              <DollarSign size={20} color={colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Price</Text>
                {params.originalPrice && params.discountAmount ? (
                  <View>
                    <Text style={styles.originalPriceText}>
                      {params.originalPrice.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS
                    </Text>
                    <Text style={styles.discountText}>
                      -{params.discountPercent}% (-{params.discountAmount.replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS)
                    </Text>
                    <Text style={styles.detailValue}>{formattedPrice} UZS</Text>
                    {params.promotionText && (
                      <Text style={styles.promotionText}>{params.promotionText}</Text>
                    )}
                  </View>
                ) : (
                  <Text style={styles.detailValue}>{formattedPrice} UZS</Text>
                )}
              </View>
            </View>
          </View>
          
          {/* Important Notes */}
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Important Notes</Text>
            <Text style={styles.notesText}>
              • Please arrive 10 minutes before your appointment time
            </Text>
            <Text style={styles.notesText}>
              • You can reschedule or cancel up to 24 hours before your appointment
            </Text>
            <Text style={styles.notesText}>
              • A confirmation SMS will be sent to your phone number
            </Text>
          </View>
        </ScrollView>
        
        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)/appointments')}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>View Appointments</Text>
          </TouchableOpacity>
          
          <Button
            title="Back to Home"
            onPress={() => router.push('/(tabs)')}
            style={styles.primaryButton}
          />
        </View>
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
    paddingBottom: 120, // Space for buttons
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  detailsContainer: {
    margin: 24,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailContent: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  notesContainer: {
    margin: 24,
    marginTop: 0,
    padding: 20,
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE066',
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  notesText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 24,
    paddingBottom: 40,
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  primaryButton: {
    marginTop: 0,
  },
  originalPriceText: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  discountText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
    marginBottom: 2,
  },
  promotionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
    marginTop: 2,
  },
});