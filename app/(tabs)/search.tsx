import React, { useState, useEffect } from 'react';
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
import { Search as SearchIcon, X, MapPin } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';
import { BusinessCard } from '@/components/BusinessCard';
import { CategoryCircle } from '@/components/CategoryCircle';
import { CitySelector } from '@/components/CitySelector';
import { businesses } from '@/mocks/businesses';
import { categories } from '@/mocks/categories';
import { cities } from '@/mocks/cities';
import { Business, Category } from '@/types';

export default function SearchScreen() {
  const params = useLocalSearchParams<{ query: string }>();
  const [searchQuery, setSearchQuery] = useState(params.query || '');
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { t, language } = useTranslation();
  const router = useRouter();
  const { selectedCity } = useAppStore();
  
  useEffect(() => {
    if (searchQuery.trim() === '' && !selectedCategory && !selectedCity) {
      setFilteredBusinesses([]);
      return;
    }
    
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = [...businesses];
      
      // Filter by city if selected
      if (selectedCity) {
        results = results.filter(business => business.cityId === selectedCity);
      }
      
      // Filter by search query
      if (searchQuery.trim() !== '') {
        results = results.filter(business => {
          const nameMatch = business.name.toLowerCase().includes(searchQuery.toLowerCase());
          
          // Check localized descriptions based on language
          let descriptionMatch = false;
          if (language === 'ru') {
            descriptionMatch = business.descriptionRu.toLowerCase().includes(searchQuery.toLowerCase());
          } else if (language === 'uz') {
            descriptionMatch = business.descriptionUz.toLowerCase().includes(searchQuery.toLowerCase());
          } else {
            descriptionMatch = business.description.toLowerCase().includes(searchQuery.toLowerCase());
          }
          
          const categoryMatch = t.categories[business.category as keyof typeof t.categories]
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
            
          return nameMatch || descriptionMatch || categoryMatch;
        });
      }
      
      // Filter by category if selected
      if (selectedCategory && selectedCategory !== 'all') {
        const category = categories.find(c => c.id === selectedCategory);
        if (category) {
          results = results.filter(business => business.category === category.name);
        }
      }
      
      setFilteredBusinesses(results);
      setLoading(false);
    }, 500);
  }, [searchQuery, selectedCategory, selectedCity, language]);
  
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
        <View style={styles.cityContainer}>
          <MapPin size={16} color={colors.textSecondary} style={styles.cityIcon} />
          <Text style={styles.cityText}>{selectedCityName}</Text>
        </View>
        <TouchableOpacity style={styles.mapsButton} activeOpacity={0.7}>
          <MapPin size={20} color={colors.primary} />
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
        <FlatList
          data={[{ id: 'all', name: 'All', nameRu: 'Все', nameUz: 'Hammasi', icon: 'grid-3x3', image: '' }, ...categories]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryCircle 
              category={item}
              onPress={handleCategoryPress}
              selected={selectedCategory === item.id}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
          ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          scrollEventThrottle={16}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <>
          {filteredBusinesses.length > 0 ? (
            <FlatList
              data={filteredBusinesses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <BusinessCard
                  business={item}
                  onPress={handleBusinessPress}
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
            </View>
          )}
        </>
      )}
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
    color: colors.text,
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
});