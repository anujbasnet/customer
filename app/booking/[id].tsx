import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Calendar, Clock, DollarSign, User } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { EmployeeCard } from '@/components/EmployeeCard';
import { getBusinessById } from '@/mocks/businesses';
import { getPromotions } from '@/mocks/promotions';
import { Service, Employee, TimeSlot } from '@/types';
import { trpc } from '@/lib/trpc';

export default function BookingScreen() {
  const { id, serviceId, employeeId, promotionId } = useLocalSearchParams<{ 
    id: string, 
    serviceId: string,
    employeeId?: string,
    promotionId?: string
  }>();
  
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { t, language } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, user, isGuestMode } = useAppStore();
  
  const business = getBusinessById(id);
  const service = business?.services.find(s => s.id === serviceId);
  
  useEffect(() => {
    // Set default selected date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
    
    // Set selected employee if employeeId is provided
    if (employeeId && business) {
      const employee = business.employees.find(e => e.id === employeeId);
      if (employee) {
        setSelectedEmployee(employee);
      }
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "You need to login to book an appointment",
        [
          {
            text: "Cancel",
            onPress: () => router.back(),
            style: "cancel"
          },
          {
            text: "Login",
            onPress: () => router.push('/(auth)/login')
          }
        ]
      );
    }
  }, [employeeId, business, isAuthenticated]);
  
  if (!business || !service) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Service not found</Text>
      </View>
    );
  }
  
  const getLocalizedServiceName = () => {
    switch (language) {
      case 'ru':
        return service.nameRu || service.name;
      case 'uz':
        return service.nameUz || service.name;
      default:
        return service.name;
    }
  };
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleEmployeeSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
  };
  
  const handleConfirmBooking = async () => {
    // Check if user is in guest mode or not authenticated
    if (isGuestMode || !isAuthenticated) {
      Alert.alert(
        "Login Required",
        "You need to login or register to book an appointment.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Login / Register",
            onPress: () => router.push('/(auth)/login')
          }
        ]
      );
      return;
    }

    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }
    
    if (business.employees.length > 1 && !selectedEmployee) {
      Alert.alert('Error', 'Please select an employee');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create the appointment
      const appointmentData = {
        businessId: business.id,
        serviceId: service.id,
        employeeId: selectedEmployee?.id || business.employees[0]?.id,
        date: selectedDate,
        time: selectedTime,
        status: 'confirmed' as const,
        userId: user?.id || '1',
        notes: ''
      };
      
      // Simulate API call - in real app this would be a tRPC mutation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to booking confirmed screen with details
      router.push({
        pathname: '/booking-confirmed',
        params: {
          businessName: business.name,
          serviceName: getLocalizedServiceName(),
          date: selectedDate,
          time: selectedTime,
          employeeName: selectedEmployee?.name || business.employees[0]?.name || '',
          price: service.price.toString()
        }
      });
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Generate dates for the next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString(language === 'en' ? 'en-US' : language === 'ru' ? 'ru-RU' : 'uz-UZ', { weekday: 'short' }),
        dayOfMonth: date.getDate(),
      });
    }
    
    return dates;
  };
  
  const dates = generateDates();
  
  // Calculate discount if promotion is applied
  const getDiscountInfo = () => {
    // Check if service itself is a promotion
    if (service.isPromotion && service.originalPrice) {
      const discountAmount = service.originalPrice - service.price;
      const discountPercent = Math.round((discountAmount / service.originalPrice) * 100);
      
      return {
        originalPrice: service.originalPrice,
        discountPercent,
        discountAmount,
        finalPrice: service.price,
        isServicePromotion: true
      };
    }
    
    // Check if promotion is applied via promotionId
    if (!promotionId) return null;
    
    const promotions = getPromotions();
    const promotion = promotions.find(p => p.id === promotionId);
    
    if (promotion && promotion.businessId === business.id) {
      if (promotion.discount === 'Free Service') {
        // Handle "Free Manicure with Pedicure" type promotions
        return {
          originalPrice: service.price,
          discountPercent: 0,
          discountAmount: 0,
          finalPrice: service.price,
          promotionText: promotion.title
        };
      } else {
        // Handle percentage discounts
        const discountPercent = parseInt(promotion.discount.replace('%', ''));
        const discountAmount = Math.round((service.price * discountPercent) / 100);
        const finalPrice = service.price - discountAmount;
        
        return {
          originalPrice: service.price,
          discountPercent,
          discountAmount,
          finalPrice
        };
      }
    }
    
    return null;
  };
  
  const discountInfo = getDiscountInfo();
  
  // Format price to include thousands separators
  const formattedPrice = (discountInfo ? discountInfo.finalPrice : service.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const formattedOriginalPrice = service.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: t.booking.confirmBooking,
          headerBackTitle: t.common.back,
        }}
      />
      
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.serviceContainer}>
            <Text style={styles.businessName}>{business.name}</Text>
            <Text style={styles.serviceName}>{getLocalizedServiceName()}</Text>
            
            <View style={styles.serviceDetails}>
              <View style={styles.serviceDetail}>
                <Clock size={16} color={colors.textSecondary} />
                <Text style={styles.serviceDetailText}>
                  {service.duration} {t.booking.minutes}
                </Text>
              </View>
              <View style={styles.serviceDetail}>
                <DollarSign size={16} color={colors.textSecondary} />
                <Text style={styles.serviceDetailText}>
                  {formattedPrice} {t.common.sum}
                </Text>
              </View>
            </View>
          </View>
          
          {business.employees.length > 1 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t.booking.selectEmployee}</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.employeesContainer}
                scrollEventThrottle={16}
              >
                {business.employees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    selected={selectedEmployee?.id === employee.id}
                    onPress={handleEmployeeSelect}
                  />
                ))}
              </ScrollView>
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.booking.selectDate}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContainer}
              scrollEventThrottle={16}
            >
              {dates.map((date) => (
                <TouchableOpacity
                  key={date.date}
                  style={[
                    styles.dateItem,
                    selectedDate === date.date && styles.selectedDateItem
                  ]}
                  onPress={() => handleDateSelect(date.date)}
                  activeOpacity={0.7}
                >
                  <Text 
                    style={[
                      styles.dateDay,
                      selectedDate === date.date && styles.selectedDateText
                    ]}
                  >
                    {date.day}
                  </Text>
                  <Text 
                    style={[
                      styles.dateDayNumber,
                      selectedDate === date.date && styles.selectedDateText
                    ]}
                  >
                    {date.dayOfMonth}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.booking.selectTime}</Text>
            <View style={styles.timeGrid}>
              {business.timeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  style={[
                    styles.timeItem,
                    !slot.isAvailable && styles.unavailableTimeItem,
                    selectedTime === slot.time && styles.selectedTimeItem
                  ]}
                  onPress={() => slot.isAvailable && handleTimeSelect(slot.time)}
                  disabled={!slot.isAvailable}
                  activeOpacity={slot.isAvailable ? 0.7 : 1}
                >
                  <Text 
                    style={[
                      styles.timeText,
                      !slot.isAvailable && styles.unavailableTimeText,
                      selectedTime === slot.time && styles.selectedTimeText
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <View style={styles.summaryContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.summaryTitle}>{t.booking.price}</Text>
              {discountInfo && (
                <View style={styles.discountInfo}>
                  <Text style={styles.originalPrice}>{formattedOriginalPrice} {t.common.sum}</Text>
                  {discountInfo.promotionText ? (
                    <Text style={styles.promotionText}>{discountInfo.promotionText}</Text>
                  ) : discountInfo.discountPercent > 0 ? (
                    <Text style={styles.discountText}>-{discountInfo.discountPercent}% ({discountInfo.discountAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} {t.common.sum})</Text>
                  ) : null}
                  {discountInfo.isServicePromotion && (
                    <Text style={styles.promotionText}>Special Offer Applied!</Text>
                  )}
                </View>
              )}
            </View>
            <Text style={styles.summaryPrice}>{formattedPrice} {t.common.sum}</Text>
          </View>
          <Button
            title={t.booking.confirmBooking}
            onPress={handleConfirmBooking}
            disabled={!selectedDate || !selectedTime || (business.employees.length > 1 && !selectedEmployee)}
            loading={loading}
            style={styles.confirmButton}
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
    paddingBottom: 80, // Extra padding for footer
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
  serviceContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  businessName: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  serviceDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  employeesContainer: {
    paddingBottom: 8,
  },
  datesContainer: {
    paddingRight: 16,
  },
  dateItem: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedDateItem: {
    backgroundColor: colors.primary,
  },
  dateDay: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  dateDayNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeItem: {
    width: '30%',
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  unavailableTimeItem: {
    backgroundColor: colors.card,
    opacity: 0.5,
  },
  selectedTimeItem: {
    backgroundColor: colors.primary,
  },
  timeText: {
    fontSize: 14,
    color: colors.text,
  },
  unavailableTimeText: {
    color: colors.textSecondary,
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  priceContainer: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  discountInfo: {
    marginTop: 4,
  },
  originalPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '500',
  },
  promotionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  summaryPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  confirmButton: {
    width: '100%',
  },
});