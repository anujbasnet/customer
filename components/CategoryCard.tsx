import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Dimensions,
  View
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from '@/hooks/useTranslation';
import { Category } from '@/types';
import { colors } from '@/constants/colors';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with 16px padding

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(category)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: category.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.overlay} />
      <Text style={styles.name}>{t.categories[category.name as keyof typeof t.categories]}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: cardWidth,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  name: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});