import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Image } from 'expo-image';
import { 
  Star, 
  MapPin, 
  Clock, 
  ChevronLeft 
} from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { ServiceCard } from '@/components/ServiceCard';
import { getProviderById } from '@/mocks/providers';
import { Service } from '@/types';

const { width } = Dimensions.get('window');

export default function ProviderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'services' | 'about' | 'reviews'>('services');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const { t } = useTranslation();
  const router = useRouter();
  
  const provider = getProviderById(id);
  
  if (!provider) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Provider not found</Text>
      </View>
    );
  }
  
  const handleServicePress = (service: Service) => {
    setSelectedService(service);
  };
  
  const handleBookAppointment = () => {
    if (selectedService) {
      router.push(`/booking/${provider.id}?serviceId=${selectedService.id}`);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: provider.name,
          headerBackTitle: t.common.back,
        }}
      />
      
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: provider.image }}
            style={styles.coverImage}
            contentFit="cover"
          />
          
          <View style={styles.header}>
            <Text style={styles.name}>{provider.name}</Text>
            <Text style={styles.category}>
              {t.categories[provider.category as keyof typeof t.categories]}
            </Text>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Text style={styles.rating}>{provider.rating}</Text>
              <Text style={styles.reviewCount}>({provider.reviewCount})</Text>
            </View>
            
            <View style={styles.addressContainer}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={styles.address}>{provider.address}</Text>
            </View>
          </View>
          
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'services' && styles.activeTab]}
              onPress={() => setActiveTab('services')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'services' && styles.activeTabText
                ]}
              >
                {t.provider.services}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'about' && styles.activeTab]}
              onPress={() => setActiveTab('about')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'about' && styles.activeTabText
                ]}
              >
                {t.provider.about}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
              onPress={() => setActiveTab('reviews')}
            >
              <Text 
                style={[
                  styles.tabText, 
                  activeTab === 'reviews' && styles.activeTabText
                ]}
              >
                {t.provider.reviews}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            {activeTab === 'services' && (
              <View>
                {provider.services.length > 0 ? (
                  provider.services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={selectedService?.id === service.id}
                      onPress={handleServicePress}
                    />
                  ))
                ) : (
                  <Text style={styles.emptyText}>{t.provider.noServices}</Text>
                )}
              </View>
            )}
            
            {activeTab === 'about' && (
              <View>
                <Text style={styles.description}>{provider.description}</Text>
                
                <Text style={styles.sectionTitle}>{t.provider.workingHours}</Text>
                <View style={styles.workingHours}>
                  <View style={styles.workingHoursItem}>
                    <Text style={styles.day}>Monday - Friday</Text>
                    <Text style={styles.hours}>9:00 AM - 7:00 PM</Text>
                  </View>
                  <View style={styles.workingHoursItem}>
                    <Text style={styles.day}>Saturday</Text>
                    <Text style={styles.hours}>10:00 AM - 6:00 PM</Text>
                  </View>
                  <View style={styles.workingHoursItem}>
                    <Text style={styles.day}>Sunday</Text>
                    <Text style={styles.hours}>Closed</Text>
                  </View>
                </View>
                
                <Text style={styles.sectionTitle}>{t.provider.address}</Text>
                <View style={styles.addressDetailContainer}>
                  <MapPin size={16} color={colors.textSecondary} />
                  <Text style={styles.addressDetail}>{provider.address}</Text>
                </View>
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
            title={t.provider.bookAppointment}
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
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
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
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
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
    paddingBottom: 100, // Add extra padding for the footer
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 24,
  },
  workingHours: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
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
  },
  bookButton: {
    width: '100%',
  },
});