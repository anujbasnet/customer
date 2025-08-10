import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  TextInput,


} from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MapPin, Scissors } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';
import { CategoryCircle } from '@/components/CategoryCircle';
import { BusinessCard } from '@/components/BusinessCard';
import { categories } from '@/mocks/categories';
import { getRecentlyVisitedBusinesses, getRecommendedBusinesses } from '@/mocks/businesses';
import { cities } from '@/mocks/cities';
import { Business, Category } from '@/types';



export default function HomeScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedCity } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get current city name
  const currentCity = cities.find(city => city.id === selectedCity);
  
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllRecommended, setShowAllRecommended] = useState(false);
  
  const recentlyVisited = getRecentlyVisitedBusinesses();
  const recommendedBusinesses = getRecommendedBusinesses();

  
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

  const handleCityPress = () => {
    // You can implement city selection modal here if needed
    console.log('City pressed:', currentCity?.name);
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
        <View style={styles.logoIcon}>
          <Scissors size={24} color={colors.primary} />
        </View>
        <Text style={styles.appName}>Rejaly.uz</Text>
        
        {/* City Display */}
        <TouchableOpacity 
          style={styles.cityButton}
          onPress={handleCityPress}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MapPin size={18} color={colors.primary} />
          <Text style={styles.cityButtonText}>
            {currentCity?.name || 'Tashkent'}
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
      
      {/* Service Types */}
      <View style={styles.categoryHeader}>
        <Text style={styles.sectionTitle}>{t.home.categories}</Text>
        <TouchableOpacity 
          onPress={() => setShowAllCategories(!showAllCategories)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.expandButton}>
            {showAllCategories ? 'Collapse' : 'Expand'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Service Types - Horizontal Scroll or Grid */}
      {showAllCategories ? (
        <View style={styles.categoriesGrid}>
          {categories.map((item) => (
            <CategoryCircle 
              key={item.id}
              category={item} 
              onPress={handleCategoryPress} 
            />
          ))}
        </View>
      ) : (
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
      )}
      
      {/* Recently Visited */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.home.recentlyVisited}</Text>
          {recentlyVisited.length > 1 && (
            <TouchableOpacity 
              onPress={() => setShowAllRecent(!showAllRecent)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.viewAll}>
                {showAllRecent ? 'Show Less' : 'View All'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {recentlyVisited.length > 0 ? (
          <>
            {(showAllRecent ? recentlyVisited : recentlyVisited.slice(0, 1)).map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onPress={handleBusinessPress}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>{t.home.noRecentlyVisited}</Text>
          </View>
        )}
      </View>
      
      
      {/* Recommendations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.home.recommendations}</Text>
          <TouchableOpacity 
            onPress={() => setShowAllRecommended(!showAllRecommended)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.viewAll}>
              {showAllRecommended ? 'Show Less' : 'View All'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {(showAllRecommended ? recommendedBusinesses.slice(0, 4) : recommendedBusinesses.slice(0, 1)).map((business) => (
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
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 12,
  },
  cityButton: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  cityButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 6,
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
    fontWeight: '500',
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
  expandButton: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
});