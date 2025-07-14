import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal,
  FlatList,
  Platform
} from 'react-native';
import { Check, MapPin } from 'lucide-react-native';
import { cities } from '@/mocks/cities';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';

export const CitySelector: React.FC = () => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { selectedCity, setSelectedCity } = useAppStore();
  const { t, language } = useTranslation();
  
  const handleSelectCity = (cityId: string) => {
    setSelectedCity(cityId);
    setModalVisible(false);
  };
  
  const getCurrentCityName = () => {
    const currentCity = cities.find(c => c.id === selectedCity);
    if (!currentCity) return '';
    
    switch (language) {
      case 'ru':
        return currentCity.nameRu;
      case 'uz':
        return currentCity.nameUz;
      default:
        return currentCity.name;
    }
  };
  
  return (
    <View>
      <TouchableOpacity 
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <MapPin size={16} color={colors.textSecondary} />
        <Text style={styles.selectorText}>{getCurrentCityName()}</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t.home.selectCity}</Text>
            
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const cityName = language === 'ru' ? item.nameRu : 
                                 language === 'uz' ? item.nameUz : 
                                 item.name;
                                 
                return (
                  <TouchableOpacity
                    style={styles.cityItem}
                    onPress={() => handleSelectCity(item.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cityName}>{cityName}</Text>
                    {selectedCity === item.id && (
                      <Check size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              scrollEventThrottle={16}
            />
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>{t.common.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  selectorText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      }
    })
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  cityName: {
    fontSize: 16,
    color: colors.text,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  closeButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
});