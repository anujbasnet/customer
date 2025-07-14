import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, User } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';
import { CategoryCircle } from '@/components/CategoryCircle';
import { BusinessCard } from '@/components/BusinessCard';
import { CitySelector } from '@/components/CitySelector';
import { categories } from '@/mocks/categories';
import { getBusinessesByCity, getRecentlyVisitedBusinesses, getRecommendedBusinesses } from '@/mocks/businesses';
import { Business, Category } from '@/types';
import { trpc } from '@/lib/trpc';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedCity, isAuthenticated } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Backend data
  const { data: backendBusinesses } = trpc.businesses.list.useQuery({ limit: 3 });
  const { data: backendStats } = trpc.stats.overview.useQuery();
  
  const recentlyVisited = getRecentlyVisitedBusinesses();
  const recommendedBusinesses = getRecommendedBusinesses();
  const cityBusinesses = selectedCity ? getBusinessesByCity(selectedCity) : [];
  
  const handleCategoryPress = (category: Category) => {
    router.push(`/category/${category.id}`);
  };
  
  const handleBusinessPress = (business: Business) => {
    router.push(`/business/${business.id}`);
  };
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/search',
        params: { query: searchQuery }
      });
    }
  };

  const handleAuthPress = () => {
    router.push('/(auth)');
  };
  
  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      scrollEventThrottle={16}
    >
      {/* Logo and App Name */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
          style={styles.logo}
          contentFit="cover"
        />
        <Text style={styles.appName}>Timely.uz</Text>
        
        {/* Login/Register Button */}
        <TouchableOpacity 
          style={styles.authButton}
          onPress={handleAuthPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <User size={20} color={colors.primary} />
          <Text style={styles.authButtonText}>
            {isAuthenticated ? t.profile.title : t.auth.login}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t.common.search}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.placeholder}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity 
          style={styles.searchButton} 
          onPress={handleSearch}
          activeOpacity={0.7}
        >
          <Search size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Service Types with City Selector */}
      <View style={styles.categoryHeader}>
        <Text style={styles.sectionTitle}>{t.home.categories}</Text>
        <CitySelector />
      </View>
      
      {/* Service Types - Horizontal Scroll */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryCircle 
            category={item} 
            onPress={handleCategoryPress} 
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        scrollEventThrottle={16}
      />
      
      {/* Recently Visited */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.home.recentlyVisited}</Text>
          <TouchableOpacity 
            onPress={() => router.push('/search')}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.viewAll}>{t.home.viewAll}</Text>
          </TouchableOpacity>
        </View>
        
        {recentlyVisited.length > 0 ? (
          recentlyVisited.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onPress={handleBusinessPress}
            />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>{t.home.noRecentlyVisited}</Text>
          </View>
        )}
      </View>
      
      {/* Backend Data Demo */}
      {backendStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backend Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{backendStats.totalBusinesses}</Text>
              <Text style={styles.statLabel}>Businesses</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{backendStats.totalAppointments}</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{backendStats.averageRating}</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </View>
          </View>
        </View>
      )}
      
      {/* Backend Businesses */}
      {backendBusinesses && backendBusinesses.businesses.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>From Backend API</Text>
          {backendBusinesses.businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onPress={handleBusinessPress}
            />
          ))}
        </View>
      )}
      
      {/* Recommendations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.home.recommendations}</Text>
          <TouchableOpacity 
            onPress={() => router.push('/search')}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.viewAll}>{t.home.viewAll}</Text>
          </TouchableOpacity>
        </View>
        
        {recommendedBusinesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            onPress={handleBusinessPress}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 12,
  },
  authButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  authButtonText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 46,
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  searchButton: {
    width: 46,
    height: 46,
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: colors.primary,
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});