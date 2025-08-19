import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Image } from 'expo-image';
import { Star, MapPin, Heart } from 'lucide-react-native';
import { Business } from '@/types';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';

interface BusinessCardProps {
  business: Business;
  onPress: (business: Business) => void;
  showFavoriteButton?: boolean;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business, onPress, showFavoriteButton = false }) => {
  const { t, language } = useTranslation();
  const { isFavorite, addToFavorites, removeFromFavorites } = useAppStore();
  
  const getLocalizedAddress = () => {
    switch (language) {
      case 'ru':
        return business.addressRu;
      case 'uz':
        return business.addressUz;
      default:
        return business.address;
    }
  };
  
  const handleFavoritePress = () => {
    if (isFavorite(business.id)) {
      removeFromFavorites(business.id);
    } else {
      addToFavorites(business);
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(business)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: business.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{business.name}</Text>
        <Text style={styles.category}>
          {t.categories[business.category as keyof typeof t.categories]}
        </Text>
        <View style={styles.addressContainer}>
          <MapPin size={14} color={colors.textSecondary} />
          <Text style={styles.address} numberOfLines={1}>
            {getLocalizedAddress()}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.warning} fill={colors.warning} />
            <Text style={styles.rating}>{business.rating}</Text>
            <Text style={styles.reviewCount}>({business.reviewCount})</Text>
          </View>
          {showFavoriteButton && (
            <TouchableOpacity 
              style={styles.favoriteButton}
              onPress={handleFavoritePress}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart 
                size={20} 
                color={isFavorite(business.id) ? colors.error : colors.textSecondary}
                fill={isFavorite(business.id) ? colors.error : 'transparent'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});