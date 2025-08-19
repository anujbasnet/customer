import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone,
  Mail,
  Heart
} from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { ServiceCard } from '@/components/ServiceCard';
import { EmployeeCard } from '@/components/EmployeeCard';
import { getBusinessById } from '@/mocks/businesses';
import { Service, Employee } from '@/types';

const { width } = Dimensions.get('window');

export default function BusinessScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'reviews'>('services');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const { t, language } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, isFavorite, addToFavorites, removeFromFavorites } = useAppStore();
  
  const business = getBusinessById(id);
  
  if (!business) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Business not found</Text>
      </View>
    );
  }
  
  const getLocalizedDescription = () => {
    switch (language) {
      case 'ru':
        return business.descriptionRu;
      case 'uz':
        return business.descriptionUz;
      default:
        return business.description;
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
  
  const getLocalizedServiceName = (service: Service) => {
    switch (language) {
      case 'ru':
        return service.nameRu || service.name;
      case 'uz':
        return service.nameUz || service.name;
      default:
        return service.name;
    }
  };
  
  const getLocalizedServiceDescription = (service: Service) => {
    switch (language) {
      case 'ru':
        return service.descriptionRu || service.description;
      case 'uz':
        return service.descriptionUz || service.description;
      default:
        return service.description;
    }
  };
  
  const handleServicePress = (service: Service) => {
    setSelectedService(service);
  };
  
  const handleEmployeePress = (employee: Employee) => {
    setSelectedEmployee(employee);
  };
  
  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      Alert.alert(
        "Login Required",
        "You need to login to book an appointment",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Login",
            onPress: () => router.push('/(auth)/login')
          }
        ]
      );
      return;
    }

    if (selectedService) {
      router.push(`/booking/${business.id}?serviceId=${selectedService.id}${selectedEmployee ? `&employeeId=${selectedEmployee.id}` : ''}`);
    }
  };
  
  const formatWorkingHours = (day: keyof typeof business.workingHours) => {
    const hours = business.workingHours[day];
    if (!hours.open || !hours.close) {
      return t.business.closed;
    }
    return `${hours.open} - ${hours.close}`;
  };
  
  const getDayName = (day: string) => {
    return t.days[day as keyof typeof t.days];
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: business.name,
          headerBackTitle: t.common.back,
        }}
      />
      
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          <Image
            source={{ uri: business.image }}
            style={styles.coverImage}
            contentFit="cover"
          />
          
          <View style={styles.header}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{business.name}</Text>
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => {
                  if (isFavorite(business.id)) {
                    removeFromFavorites(business.id);
                  } else {
                    addToFavorites(business);
                  }
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Heart 
                  size={24} 
                  color={isFavorite(business.id) ? colors.error : colors.textSecondary}
                  fill={isFavorite(business.id) ? colors.error : 'transparent'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.category}>
              {t.categories[business.category as keyof typeof t.categories]}
            </Text>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Text style={styles.rating}>{business.rating}</Text>
              <Text style={styles.reviewCount}>({business.reviewCount})</Text>
            </View>
            
            <View style={styles.contactContainer}>
              <View style={styles.contactItem}>
                <MapPin size={16} color={colors.textSecondary} />
                <Text style={styles.contactText}>{getLocalizedAddress()}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Phone size={16} color={colors.textSecondary} />
                <Text style={styles.contactText}>{business.phone}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Mail size={16} color={colors.textSecondary} />
                <Text style={styles.contactText}>{business.email}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'services' && styles.activeTab]}
              onPress={() => setActiveTab('services')}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'services' && styles.activeTabText
                ]}
              >
                {t.business.services}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'about' && styles.activeTab]}
              onPress={() => setActiveTab('about')}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'about' && styles.activeTabText
                ]}
              >
                {t.business.about}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
              onPress={() => setActiveTab('reviews')}
              activeOpacity={0.7}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'reviews' && styles.activeTabText
                ]}
              >
                {t.business.reviews}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            {activeTab === 'services' && (
              <View>
                {business.employees.length > 1 && (
                  <View style={styles.employeesSection}>
                    <Text style={styles.sectionTitle}>{t.business.employees}</Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.employeesList}
                      scrollEventThrottle={16}
                    >
                      {business.employees.map((employee) => (
                        <EmployeeCard
                          key={employee.id}
                          employee={employee}
                          selected={selectedEmployee?.id === employee.id}
                          onPress={handleEmployeePress}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}
                
                <Text style={styles.sectionTitle}>{t.business.services}</Text>
                {business.services.length > 0 ? (
                  business.services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={{
                        ...service,
                        name: getLocalizedServiceName(service),
                        description: getLocalizedServiceDescription(service)
                      }}
                      selected={selectedService?.id === service.id}
                      onPress={handleServicePress}
                      currencySymbol={t.common.sum}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyText}>{t.business.noServices}</Text>
                )}
              </View>
            )}
            
            {activeTab === 'about' && (
              <View>
                <Text style={styles.description}>{getLocalizedDescription()}</Text>
                
                <Text style={styles.sectionTitle}>{t.business.workingHours}</Text>
                <View style={styles.workingHours}>
                  {Object.entries(business.workingHours).map(([day, hours]) => (
                    <View key={day} style={styles.workingHoursItem}>
                      <Text style={styles.day}>{getDayName(day)}</Text>
                      <Text style={styles.hours}>{formatWorkingHours(day as keyof typeof business.workingHours)}</Text>
                    </View>
                  ))}
                </View>
                
                <Text style={styles.sectionTitle}>{t.business.address}</Text>
                <View style={styles.addressDetailContainer}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={styles.addressDetail}>{getLocalizedAddress()}</Text>
                </View>
                
                {business.portfolio && business.portfolio.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>{t.business.portfolio}</Text>
                    <View style={styles.portfolioContainer}>
                      {business.portfolio.map((item) => (
                        <View key={item.id} style={styles.portfolioItem}>
                          <Image
                            source={{ uri: item.image }}
                            style={styles.portfolioImage}
                            contentFit="cover"
                          />
                          <View style={styles.portfolioContent}>
                            <Text style={styles.portfolioTitle}>{item.title}</Text>
                            {item.description && (
                              <Text style={styles.portfolioDescription}>{item.description}</Text>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            )}
            
            {activeTab === 'reviews' && (
              <View style={styles.reviewsContainer}>
                <Text style={styles.reviewsText}>
                  Reviews coming soon...
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title={t.business.bookAppointment}
            onPress={handleBookAppointment}
            disabled={!selectedService}
            style={styles.bookButton}
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
  coverImage: {
    width: width,
    height: 200,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
    marginLeft: 12,
  },
  category: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  contactContainer: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
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
  content: {
    padding: 16,
  },
  employeesSection: {
    marginBottom: 24,
  },
  employeesList: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 24,
  },
  workingHours: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  workingHoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  day: {
    fontSize: 14,
    color: colors.text,
  },
  hours: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  addressDetailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
  },
  addressDetail: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  reviewsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  reviewsText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
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
  bookButton: {
    width: '100%',
  },
  portfolioContainer: {
    gap: 16,
    marginTop: 16,
  },
  portfolioItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  portfolioImage: {
    width: '100%',
    height: 200,
  },
  portfolioContent: {
    padding: 16,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  portfolioDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});