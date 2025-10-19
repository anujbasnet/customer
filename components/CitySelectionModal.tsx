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
  const { setSelectedCity, selectedCity, darkModeEnabled } = useAppStore();

  const colors = {
    background: darkModeEnabled ? '#121212' : '#FFFFFF',
    card: darkModeEnabled ? '#1E1E1E' : '#F9FAFB',
    text: darkModeEnabled ? '#FFFFFF' : '#000000',
    textSecondary: darkModeEnabled ? '#AAAAAA' : '#6B7280',
    border: darkModeEnabled ? '#333333' : '#E5E7EB',
    primary: '#3B82F6',
    placeholder: darkModeEnabled ? '#888888' : '#A1A1AA',
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
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
      if (navigator.geolocation) {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setIsLocating(false);
            const tashkent = cities.find(city => city.id === '1');
            if (tashkent) handleCitySelect(tashkent);
          },
          () => {
            setIsLocating(false);
            Alert.alert('Error', 'Unable to get your location. Please select a city manually.');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } else {
        Alert.alert('Error', 'Geolocation is not supported by this browser.');
      }
    } else {
      try {
        setIsLocating(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setIsLocating(false);
          Alert.alert('Permission denied', 'Please allow location access to use this feature.');
          return;
        }
        await Location.getCurrentPositionAsync({});
        setIsLocating(false);
        const tashkent = cities.find(city => city.id === '1');
        if (tashkent) handleCitySelect(tashkent);
      } catch {
        setIsLocating(false);
        Alert.alert('Error', 'Unable to get your location. Please select a city manually.');
      }
    }
  };

  const getCityName = (city: City) => {
    switch (language) {
      case 'ru': return city.nameRu;
      case 'uz': return city.nameUz;
      default: return city.name;
    }
  };

  const renderCityItem = ({ item }: { item: City }) => {
    const isSelected = selectedCity === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.cityItem,
          { backgroundColor: isSelected ? colors.primary + '22' : colors.background }
        ]}
        onPress={() => handleCitySelect(item)}
        activeOpacity={0.7}
      >
        <MapPin size={20} color={isSelected ? colors.primary : colors.textSecondary} />
        <Text style={[styles.cityName, { color: isSelected ? colors.primary : colors.text }]}>
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
      transparent={false}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{'Select City'}</Text>
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
            style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="Search cities..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity
          style={[styles.autoLocationButton, { backgroundColor: colors.card, borderColor: colors.primary }]}
          onPress={handleAutoLocation}
          disabled={isLocating}
          activeOpacity={0.7}
        >
          {isLocating ? <ActivityIndicator size="small" color={colors.primary} /> : <Navigation size={20} color={colors.primary} />}
          <Text style={[styles.autoLocationText, { color: colors.primary }]}>
            {isLocating ? 'Getting location...' : 'Use my current location'}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={filteredCities}
          keyExtractor={item => item.id}
          renderItem={renderCityItem}
          contentContainerStyle={styles.citiesList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1 },
  title: { fontSize: 20, fontWeight: '600' },
  closeButton: { padding: 4 },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  searchInput: { height: 48, borderRadius: 8, paddingHorizontal: 16, fontSize: 16 },
  autoLocationButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginBottom: 16, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1 },
  autoLocationText: { fontSize: 16, fontWeight: '500', marginLeft: 8 },
  citiesList: { paddingHorizontal: 16 },
  cityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 8 },
  cityName: { fontSize: 16, marginLeft: 12 },
  separator: { height: 1, marginLeft: 44 },
});
