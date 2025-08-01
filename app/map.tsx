import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ArrowLeft, MapPin, Filter } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';
import { businesses } from '@/mocks/businesses';
import { categories } from '@/mocks/categories';
import { cities } from '@/mocks/cities';
import { Business, Category } from '@/types';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  
  const { t, language } = useTranslation();
  const router = useRouter();
  const { selectedCity } = useAppStore();
  
  useEffect(() => {
    let results = [...businesses];
    
    // Filter by city if selected
    if (selectedCity) {
      results = results.filter(business => business.cityId === selectedCity);
    }
    
    // Filter by category if specified
    if (params.categoryId && params.categoryId !== 'all') {
      const category = categories.find(c => c.id === params.categoryId);
      if (category) {
        results = results.filter(business => business.category === category.name);
      }
    }
    
    setFilteredBusinesses(results);
  }, [params.categoryId, selectedCity]);
  
  const handleBusinessPress = (business: Business) => {
    router.push(`/business/${business.id}`);
  };
  
  const selectedCityName = selectedCity 
    ? cities.find(city => city.id === selectedCity)?.[language === 'ru' ? 'nameRu' : language === 'uz' ? 'nameUz' : 'name'] || 'City'
    : 'Select City';
    
  const categoryName = params.categoryId && params.categoryId !== 'all'
    ? categories.find(c => c.id === params.categoryId)?.[language === 'ru' ? 'nameRu' : language === 'uz' ? 'nameUz' : 'name'] || 'All'
    : 'All';

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Maps',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => {
                Alert.alert('Filter', 'Filter options coming soon');
              }}
              style={styles.headerButton}
              activeOpacity={0.7}
            >
              <Filter size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.infoContainer}>
        <View style={styles.locationInfo}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={styles.locationText}>{selectedCityName}</Text>
        </View>
        <Text style={styles.categoryText}>
          {categoryName === 'All' ? 'All Services' : categoryName}
        </Text>
        <Text style={styles.countText}>
          {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'location' : 'locations'} found
        </Text>
      </View>
      
      {/* Mock Map View */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color={colors.primary} />
          <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
          <Text style={styles.mapSubText}>Google Maps integration coming soon</Text>
        </View>
        
        {/* Mock Map Pins */}
        {filteredBusinesses.slice(0, 5).map((business, index) => (
          <TouchableOpacity
            key={business.id}
            style={[
              styles.mapPin,
              {
                left: 50 + (index * 60),
                top: 150 + (index * 40),
              }
            ]}
            onPress={() => setSelectedBusiness(business)}
            activeOpacity={0.8}
          >
            <View style={styles.pinContainer}>
              <MapPin size={20} color={colors.white} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Business Info Card */}
      {selectedBusiness && (
        <View style={styles.businessCard}>
          <View style={styles.businessInfo}>
            <Text style={styles.businessName} numberOfLines={1}>
              {selectedBusiness.name}
            </Text>
            <Text style={styles.businessCategory} numberOfLines={1}>
              {t.categories[selectedBusiness.category as keyof typeof t.categories]}
            </Text>
            <Text style={styles.businessAddress} numberOfLines={1}>
              {language === 'ru' ? selectedBusiness.addressRu : 
               language === 'uz' ? selectedBusiness.addressUz : 
               selectedBusiness.address}
            </Text>
            <View style={styles.businessRating}>
              <Text style={styles.ratingText}>⭐ {selectedBusiness.rating}</Text>
              <Text style={styles.reviewCount}>({selectedBusiness.reviewCount} reviews)</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleBusinessPress(selectedBusiness)}
            activeOpacity={0.8}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    padding: 8,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  countText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  mapSubText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  mapPin: {
    position: 'absolute',
    zIndex: 10,
  },
  pinContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
      }
    })
  },
  businessCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      }
    })
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
  businessCategory: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 2,
  },
  businessAddress: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  businessRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: colors.text,
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  viewButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
});