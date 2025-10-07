import React, { useState, useEffect } from 'react';
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
import { getBusinessById as getMockBusinessById } from '@/mocks/businesses';
import axios from 'axios';
import { Service, Employee } from '@/types';

const { width } = Dimensions.get('window');

export default function BusinessScreen() {
  const { id, promotionId } = useLocalSearchParams<{ id: string; promotionId?: string }>();
  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'reviews'>('services');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const { t, language } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, isFavorite, addToFavorites, removeFromFavorites } = useAppStore();
  
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const fetchBusiness = async () => {
      setLoading(true); setError('');
      try {
        // Try backend first
        const res = await axios.get(`http://192.168.1.5:5000/api/admin/business/${id}`);
        const apiBiz = res.data.business || res.data; // controller wraps in { business }
        // --- Normalize working hours coming from backend ---
        const normalizeWorkingHours = (raw: any) => {
          if (!raw || typeof raw !== 'object') return {};
          // If already looks like { Monday: {open:'', close:''}, ... }
            const sampleVal = raw[Object.keys(raw)[0]];
            if (sampleVal && typeof sampleVal === 'object' && ('open' in sampleVal || 'close' in sampleVal)) {
              return raw; // assume already normalized
            }
          const daysOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
          const result: Record<string, { open: string|null; close: string|null }> = {};
          const parseTimeRange = (range: string) => {
            if (!range || range.toLowerCase() === 'closed') return { open: null, close: null };
            const parts = range.split('-');
            if (parts.length === 2) return { open: parts[0].trim(), close: parts[1].trim() };
            return { open: null, close: null };
          };
          const expandRange = (key: string, value: string) => {
            if (key.includes('-')) {
              // e.g. "Monday - Friday"
              const [start, end] = key.split('-').map(p => p.trim());
              const startIdx = daysOrder.indexOf(start);
              const endIdx = daysOrder.indexOf(end);
              if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
                for (let i = startIdx; i <= endIdx; i++) {
                  result[daysOrder[i]] = parseTimeRange(value);
                }
                return;
              }
            }
            // Single day key
            result[key] = parseTimeRange(value);
          };
          Object.entries(raw).forEach(([k, v]) => expandRange(k, String(v)));
          // Ensure any missing days are marked closed for consistency
          daysOrder.forEach(d => { if (!result[d]) result[d] = { open: null, close: null }; });
          return result;
        };
        // Normalize fields to match component expectations
        const normalized = {
          id: apiBiz.id || apiBiz._id || id,
            name: apiBiz.name || apiBiz.full_name || 'Business',
            category: apiBiz.service_type || 'general',
            address: apiBiz.address || '',
            addressRu: apiBiz.addressRu || apiBiz.address || '',
            addressUz: apiBiz.addressUz || apiBiz.address || '',
            phone: apiBiz.phone || apiBiz.phone_number || '',
            email: apiBiz.email || '',
            description: apiBiz.description || '',
            descriptionRu: apiBiz.descriptionRu || apiBiz.description || '',
            descriptionUz: apiBiz.descriptionUz || apiBiz.description || '',
            rating: apiBiz.rating || 0,
            reviewCount: apiBiz.reviewCount || 0,
            image: apiBiz.coverPhotoUrl || apiBiz.imageUrl || apiBiz.logoUrl || apiBiz.image || 'https://via.placeholder.com/800x400?text=Business',
            employees: apiBiz.staff || [],
            services: apiBiz.services || [],
            workingHours: normalizeWorkingHours(apiBiz.workingHours || {}),
            portfolio: apiBiz.portfolio || [],
        };
        if (active) setBusiness(normalized);
      } catch (err) {
        // fallback to mock
        const mock = getMockBusinessById(id as string);
        if (mock) {
          if (active) setBusiness(mock);
        } else {
          if (active) setError('Business not found');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchBusiness();
    return () => { active = false; };
  }, [id]);
  
  // Auto-select promotional service if promotionId is provided
  React.useEffect(() => {
    if (promotionId && business) {
  const promotionalService = business.services.find((s: any) => s.isPromotion && s.promotionId === promotionId);
      if (promotionalService) {
        setSelectedService(promotionalService);
      }
    }
  }, [promotionId, business]);
  
  if (loading) {
    return <View style={styles.notFoundContainer}><Text style={styles.notFoundText}>{t.common.loading || 'Loading...'}</Text></View>;
  }
  if (!business) {
    return <View style={styles.notFoundContainer}><Text style={styles.notFoundText}>{error || 'Business not found'}</Text></View>;
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
      const params = new URLSearchParams({
        serviceId: selectedService.id,
        ...(selectedEmployee && { employeeId: selectedEmployee.id }),
        ...(promotionId && { promotionId })
      });
      router.push(`/booking/${business.id}?${params.toString()}`);
    }
  };
  
  const formatWorkingHours = (day: keyof typeof business.workingHours) => {
    const hours = business.workingHours[day];
    if (!hours) return t.business.closed;
    // If it's a string (legacy) just show or interpret closed
    if (typeof hours === 'string') {
      if (hours.toLowerCase() === 'closed') return t.business.closed;
      // Try parse "HH:MM - HH:MM"
      const parts = hours.split('-');
      if (parts.length === 2) return `${parts[0].trim()} - ${parts[1].trim()}`;
      return hours;
    }
    if (!hours.open || !hours.close) return t.business.closed;
    return `${hours.open} - ${hours.close}`;
  };
  
  const getDayName = (day: string) => {
    if (!t || !t.days) return day;
    const variants = [
      day,
      day.toLowerCase(),
      day.slice(0,3).toLowerCase(), // Mon, Tue, etc.
      day.replace(/\s+/g,'').toLowerCase(), // mondayfriday style (just in case)
    ];
    for (const v of variants) {
      if ((t.days as any)[v]) return (t.days as any)[v];
    }
    return day; // fallback raw
  };

  const orderedDays = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  // Safely resolve category translation with fallbacks
  const getCategoryLabel = () => {
    if (!business) return '';
    const raw = business.category || business.service_type || business.service_name;
    if (!raw) return '';
    const cats: any = (t as any).categories || (t.business && (t.business as any).categories) || {};
    // Try several key normalization strategies
    const direct = cats[raw];
    if (direct) return direct;
    const lower = cats[raw.toLowerCase()];
    if (lower) return lower;
    const underscoredKey = raw.replace(/\s+/g, '_').toLowerCase();
    const underscored = cats[underscoredKey];
    if (underscored) return underscored;
    // Fallback to raw value
    return raw;
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
              {getCategoryLabel()}
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
                      {business.employees.map((employee: any) => (
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
                {promotionId && (
                  <View style={styles.promotionNotice}>
                    <Text style={styles.promotionNoticeText}>
                      🎉 Special promotion applied! Select a service to see discounted pricing.
                    </Text>
                  </View>
                )}
                {business.services.length > 0 ? (
                  business.services.map((service: any) => {
                    // Check if this service is part of the promotion
                    const isPromotionalService = service.isPromotion && service.promotionId === promotionId;
                    
                    return (
                      <ServiceCard
                        key={service.id}
                        service={{
                          ...service,
                          name: getLocalizedServiceName(service),
                          description: getLocalizedServiceDescription(service)
                        }}
                        selected={selectedService?.id === service.id || isPromotionalService}
                        onPress={handleServicePress}
                        currencySymbol={t.common.sum}
                      />
                    );
                  })
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
                  {orderedDays.map(day => (
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
                      {business.portfolio.map((item: any) => (
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
  promotionNotice: {
    backgroundColor: colors.primary + '15',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  promotionNoticeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});