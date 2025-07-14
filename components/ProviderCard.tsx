import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';
import { Provider } from '@/types';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

interface ProviderCardProps {
  provider: Provider;
  onPress: (provider: Provider) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onPress }) => {
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(provider)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: provider.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.content}>
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.category}>
          {t.categories[provider.category as keyof typeof t.categories]}
        </Text>
        <View style={styles.ratingContainer}>
          <Star size={16} color={colors.warning} fill={colors.warning} />
          <Text style={styles.rating}>{provider.rating}</Text>
          <Text style={styles.reviewCount}>({provider.reviewCount})</Text>
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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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