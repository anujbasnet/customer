import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { X, MapPin, Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { cities } from '@/mocks/cities';
import { City } from '@/types';

interface CitySelectionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CitySelectionModal: React.FC<CitySelectionModalProps> = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>(cities);
  const [isLocating, setIsLocating] = useState(false);
  
  const { t, language } = useTranslation();
  const { setSelectedCity, selectedCity } = useAppStore();
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city => {
        const name = language === 'ru' ? city.nameRu : language === 'uz' ? city.nameUz : city.name;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredCities(filtered);
    }
  }, [searchQuery, language]);
  
  const handleCitySelect = (city: City) => {
    setSelectedCity(city.id);
    onClose();
  };
  
  const handleAutoLocation = async () => {
    if (Platform.OS === 'web') {
      // Use web geolocation API
      if (navigator.geolocation) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setIsLocating(false);
            // For demo purposes, just select Tashkent
            // In a real app, you would reverse geocode the coordinates
            const tashkent = cities.find(city => city.id === '1');
            if (tashkent) {
              handleCitySelect(tashkent);
            }
          },
          (error) => {
            setIsLocating(false);
            Alert.alert('Error', 'Unable to get your location. Please select a city manually.');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        Alert.alert('Error', 'Geolocation is not supported by this browser.');
      }
    } else {
      // Use expo-location for mobile
      try {
        setIsLocating(true);
        
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setIsLocating(false);
          Alert.alert('Permission denied', 'Please allow location access to use this feature.');
          return;
        }
        
        let location = await Location.getCurrentPositionAsync({});
        setIsLocating(false);
        
        // For demo purposes, just select Tashkent
        // In a real app, you would reverse geocode the coordinates
        const tashkent = cities.find(city => city.id === '1');
        if (tashkent) {
          handleCitySelect(tashkent);
        }
      } catch (error) {
        setIsLocating(false);
        Alert.alert('Error', 'Unable to get your location. Please select a city manually.');
      }
    }
  };
  
  const getCityName = (city: City) => {
    switch (language) {
      case 'ru':
        return city.nameRu;
      case 'uz':
        return city.nameUz;
      default:
        return city.name;
    }
  };
  
  const renderCityItem = ({ item }: { item: City }) => {
    const isSelected = selectedCity === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.cityItem, isSelected && styles.selectedCityItem]}
        onPress={() => handleCitySelect(item)}
        activeOpacity={0.7}
      >
        <MapPin size={20} color={isSelected ? colors.primary : colors.textSecondary} />
        <Text style={[styles.cityName, isSelected && styles.selectedCityName]}>
          {getCityName(item)}
        </Text>
      </TouchableOpacity>
    );
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select City</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search cities..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.placeholder}
          />
        </View>
        
        <TouchableOpacity
          style={styles.autoLocationButton}
          onPress={handleAutoLocation}
          disabled={isLocating}
          activeOpacity={0.7}
        >
          {isLocating ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Navigation size={20} color={colors.primary} />
          )}
          <Text style={styles.autoLocationText}>
            {isLocating ? 'Getting location...' : 'Use my current location'}
          </Text>
        </TouchableOpacity>
        
        <FlatList
          data={filteredCities}
          keyExtractor={(item) => item.id}
          renderItem={renderCityItem}
          contentContainerStyle={styles.citiesList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    height: 48,
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  autoLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  autoLocationText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  citiesList: {
    paddingHorizontal: 16,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  selectedCityItem: {
    backgroundColor: colors.card,
    borderRadius: 8,
  },
  cityName: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  selectedCityName: {
    color: colors.primary,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 44,
  },
});