import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { trpc } from '@/lib/trpc';

export const BackendTest = () => {
  const { data: testData, isLoading, error } = trpc.test.data.useQuery();
  const { data: businesses, isLoading: businessesLoading } = trpc.businesses.list.useQuery({ limit: 3 });
  const { data: categories, isLoading: categoriesLoading } = trpc.categories.list.useQuery();

  if (isLoading || businessesLoading || categoriesLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading backend data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Backend Test Results</Text>
      
      {testData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Data</Text>
          <Text style={styles.text}>{testData.message}</Text>
          <Text style={styles.text}>Total Businesses: {testData.totalBusinesses}</Text>
          <Text style={styles.text}>Total Categories: {testData.totalCategories}</Text>
          <Text style={styles.text}>Total Appointments: {testData.totalAppointments}</Text>
        </View>
      )}

      {businesses && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sample Businesses ({businesses.businesses.length})</Text>
          {businesses.businesses.map((business) => (
            <View key={business.id} style={styles.item}>
              <Text style={styles.itemTitle}>{business.name}</Text>
              <Text style={styles.itemText}>Category: {business.category}</Text>
              <Text style={styles.itemText}>Rating: {business.rating} ⭐</Text>
              <Text style={styles.itemText}>Services: {business.services.length}</Text>
            </View>
          ))}
        </View>
      )}

      {categories && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories ({categories.length})</Text>
          {categories.slice(0, 5).map((category) => (
            <View key={category.id} style={styles.item}>
              <Text style={styles.itemTitle}>{category.name}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#007AFF',
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  item: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
    color: '#666',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    fontSize: 16,
  },
});