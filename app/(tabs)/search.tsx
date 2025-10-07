import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Search as SearchIcon, X, MapPin, Map } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';
import { BusinessCard } from '@/components/BusinessCard';
import { CategoryCircle } from '@/components/CategoryCircle';
import { CitySelectionModal } from '@/components/CitySelectionModal';
import { fetchAllBusinesses } from '@/lib/api';
import { categories } from '@/mocks/categories';
import { cities } from '@/mocks/cities';
import { Business, Category } from '@/types';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ query: string }>();
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<Business[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // only used for network now (kept for compatibility)
  const [initialLoading, setInitialLoading] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { t, language } = useTranslation();
  const router = useRouter();
  const { selectedCity } = useAppStore();
  
  // Initial fetch
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const backendList = await fetchAllBusinesses();
        const mapped: Business[] = backendList.map((b: any): Business => ({
          id: b.id,
          name: b.name,
          category: normalizeCategory(b.category),
          cityId: b.cityId || selectedCity || '1',
          address: b.address || '',
          addressRu: b.addressRu || b.address || '',
          addressUz: b.addressUz || b.address || '',
          phone: b.phone || '',
          email: b.email || '',
          description: b.service || b.description || '',
          descriptionRu: b.descriptionRu || b.description || '',
          descriptionUz: b.descriptionUz || b.description || '',
          rating: b.rating || 0,
          reviewCount: b.reviewCount || 0,
          image: b.image || b.coverPhotoUrl || 'https://via.placeholder.com/600x400?text=Business',
          employees: b.employees || [],
          workingHours: b.workingHours || {
            monday: { open: null, close: null },
            tuesday: { open: null, close: null },
            wednesday: { open: null, close: null },
            thursday: { open: null, close: null },
            friday: { open: null, close: null },
            saturday: { open: null, close: null },
            sunday: { open: null, close: null }
          },
          timeSlots: b.timeSlots || [],
          services: b.services || [],
          latitude: b.latitude || 0,
          longitude: b.longitude || 0,
          portfolio: b.portfolio || []
        }));
        if (!cancelled) {
          setAllBusinesses(mapped);
        }
      } catch (err) {
        console.error('search screen fetch businesses error', err);
        if (!cancelled) setError('Failed to fetch businesses. Please try again later.');
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  // Debounce search input
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    // Immediate apply for snappy feel (especially clearing input)
    applyFilters(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Debounced re-apply to catch slower typing for any future heavier logic
    debounceRef.current = setTimeout(() => {
      applyFilters(false);
    }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, selectedCity, language, allBusinesses]);

  function normalizeCategory(raw?: string): string {
    if (!raw) return 'others';
    const lowered = raw.replace(/\s+|&/g, '').toLowerCase();
    const map: Record<string, string> = {
      barber: 'barber',
      hairsalon: 'hairSalon',
      nailsalon: 'nailSalon',
      spaandmassage: 'spaAndMassage',
      dentist: 'dental',
      dental: 'dental',
      football: 'football',
      footballfields: 'football',
      videogaming: 'videogaming',
      others: 'others'
    };
    return map[lowered] || 'others';
  }

  function applyFilters(showLoading: boolean = false) {
    if (showLoading) setLoading(true);
    const q = searchQuery.trim().toLowerCase();
    const categoryObj = selectedCategory && selectedCategory !== 'all' ? categories.find(c => c.id === selectedCategory || c.name === selectedCategory) : null;
    let result = [...allBusinesses];

    if (selectedCity) {
      result = result.filter(b => b.cityId === selectedCity);
    }

    if (categoryObj) {
      result = result.filter(b => b.category === categoryObj.name || b.category === categoryObj.id);
    }

    if (q) {
      result = result.filter(b => {
        const descField = language === 'ru' ? b.descriptionRu : language === 'uz' ? b.descriptionUz : b.description;
        const servicesText = (b.services || [])
          .map((s: any) => [s.name, s.nameRu, s.nameUz, s.description, s.descriptionRu, s.descriptionUz]
            .filter(Boolean)
            .join(' '))
          .join(' ')
          .toLowerCase();
        const catTranslationRoot: any = (t as any).categories || (t as any).business?.categories || {};
        const categoryLabel = (catTranslationRoot?.[b.category] || b.category || '').toString().toLowerCase();
        // Derive additional category tokens (split camelCase, etc.)
        const categoryTokens = new Set<string>();
        const addTokens = (str?: string) => {
          if (!str) return;
          const base = str.toLowerCase();
            categoryTokens.add(base);
            base.replace(/([a-z])([A-Z])/g, '$1 $2')
              .split(/[^a-z0-9]+/i)
              .filter(Boolean)
              .forEach(tok => categoryTokens.add(tok.toLowerCase()));
        };
        addTokens(b.category);
        addTokens(categoryLabel);
        // Location/address strings
        const addressText = [b.address, (b as any).addressRu, (b as any).addressUz]
          .filter(Boolean)
          .join(' ') // join addresses
          .toLowerCase();
        // City name matching (if user types a city, include businesses in that city)
        const cityObj = cities.find(c => c.id === b.cityId);
        const cityNames = cityObj ? [cityObj.name, cityObj.nameRu, cityObj.nameUz].map(n => n.toLowerCase()) : [];
        return (
          b.name.toLowerCase().includes(q) ||
          descField?.toLowerCase().includes(q) ||
          categoryLabel.includes(q) ||
          servicesText.includes(q) ||
          addressText.includes(q) ||
          cityNames.some(n => n.includes(q)) ||
          Array.from(categoryTokens).some(tok => tok.includes(q))
        );
      });
    }

    setFilteredBusinesses(result);
    if (showLoading) setLoading(false);
  }
  
  const handleCategoryPress = (category: Category) => {
    if (category.id === 'all') {
      setSelectedCategory(null);
    } else if (selectedCategory === category.id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category.id);
    }
  };
  
  const handleBusinessPress = (business: Business) => {
    router.push(`/business/${business.id}`);
  };
  
  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };
  
  const selectedCityName = selectedCity 
    ? cities.find(city => city.id === selectedCity)?.[language === 'ru' ? 'nameRu' : language === 'uz' ? 'nameUz' : 'name'] || 'City'
    : 'Select City';

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.cityContainer}
          onPress={() => setShowCityModal(true)}
          activeOpacity={0.7}
        >
          <MapPin size={16} color={colors.primary} style={styles.cityIcon} />
          <Text style={styles.cityText}>{selectedCityName}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.mapsButton} 
          activeOpacity={0.7}
          onPress={() => router.push(`/map?categoryId=${selectedCategory || 'all'}`)}
        >
          <Map size={20} color={colors.primary} />
          <Text style={styles.mapsText}>Maps</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t.common.search}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.placeholder}
          />
          {(searchQuery.length > 0 || selectedCategory) && (
            <TouchableOpacity 
              onPress={clearSearch} 
              style={styles.clearButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      <View style={styles.filtersContainer}>
        <View style={styles.filtersHeader}>
          <Text style={styles.filtersTitle}>Service Types</Text>
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
        
        {showAllCategories ? (
          <View style={styles.categoriesGrid}>
            {[{ id: 'all', name: 'All', nameRu: 'Все', nameUz: 'Hammasi', icon: 'grid-3x3', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop&crop=center' }, ...categories].map((item) => (
              <CategoryCircle 
                key={item.id}
                category={item}
                onPress={handleCategoryPress}
                selected={selectedCategory === item.id || (selectedCategory === null && item.id === 'all')}
              />
            ))}
          </View>
        ) : (
          <FlatList
            data={[{ id: 'all', name: 'All', nameRu: 'Все', nameUz: 'Hammasi', icon: 'grid-3x3', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=100&fit=crop&crop=center' }, ...categories]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CategoryCircle 
                category={item}
                onPress={handleCategoryPress}
                selected={selectedCategory === item.id || (selectedCategory === null && item.id === 'all')}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
            scrollEventThrottle={16}
          />
        )}
      </View>
      
      {(initialLoading) ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={() => { setSearchQuery(''); setSelectedCategory(null); }}>
                <Text style={styles.retryText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
          )}
          {filteredBusinesses.length > 0 ? (
            <FlatList
              data={filteredBusinesses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <BusinessCard
                  business={item}
                  onPress={handleBusinessPress}
                  showFavoriteButton={true}
                />
              )}
              contentContainerStyle={styles.businessesList}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
            />
          ) : (
            <View style={styles.emptyContainer}>
              {(searchQuery.trim() !== '' || selectedCategory || selectedCity) ? (
                <Text style={styles.emptyText}>No results found</Text>
              ) : (
                <Text style={styles.emptyText}>Search for services or select a category</Text>
              )}
              {!error && (
                <Text style={styles.metaText}>Fetched: {filteredBusinesses.length} | City: {selectedCity || 'any'}</Text>
              )}
            </View>
          )}
        </>
      )}
      
      <CitySelectionModal
        visible={showCityModal}
        onClose={() => setShowCityModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  cityContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityIcon: {
    marginRight: 6,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  mapsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderRadius: 8,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      }
    })
  },
  mapsText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 4,
  },
  searchContainer: {
    padding: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      }
    })
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: colors.text,
  },
  clearButton: {
    padding: 8,
  },
  filtersContainer: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
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

  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  businessesList: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorBox: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '600'
  },
  retryText: {
    marginTop: 8,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500'
  },
  metaText: {
    marginTop: 12,
    fontSize: 12,
    color: colors.textSecondary
  }
});