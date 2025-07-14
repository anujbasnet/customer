import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { colors } from '@/constants/colors';
import { BusinessCard } from '@/components/BusinessCard';
import { categories } from '@/mocks/categories';
import { getBusinessesByCategory } from '@/mocks/businesses';
import { Business } from '@/types';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedCity } = useAppStore();
  
  const category = categories.find(c => c.id === id);
  
  if (!category) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Category not found</Text>
      </View>
    );
  }
  
  // Get businesses by category and filter by selected city if available
  const categoryBusinesses = getBusinessesByCategory(category.name);
  const filteredBusinesses = selectedCity 
    ? categoryBusinesses.filter(business => business.cityId === selectedCity)
    : categoryBusinesses;
  
  const handleBusinessPress = (business: Business) => {
    router.push(`/business/${business.id}`);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: t.categories[category.name as keyof typeof t.categories],
          headerBackTitle: t.common.back,
        }}
      />
      
      <View style={styles.container}>
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
            <Text style={styles.emptyText}>No businesses found in this category</Text>
          </View>
        )}
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
  businessesList: {
    padding: 16,
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