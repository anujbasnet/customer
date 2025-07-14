import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View
} from 'react-native';
import { Image } from 'expo-image';
import { useTranslation } from '@/hooks/useTranslation';
import { Category } from '@/types';
import { colors } from '@/constants/colors';

interface CategoryCircleProps {
  category: Category;
  onPress: (category: Category) => void;
  selected?: boolean;
}

export const CategoryCircle: React.FC<CategoryCircleProps> = ({ 
  category, 
  onPress,
  selected = false
}) => {
  const { t } = useTranslation();
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <View style={[
        styles.imageContainer,
        selected && styles.selectedImageContainer
      ]}>
        <Image
          source={{ uri: category.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>
      <Text style={[
        styles.name, 
        selected && styles.selectedName
      ]} numberOfLines={1}>
        {t.categories[category.name as keyof typeof t.categories]}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: colors.card,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selectedImageContainer: {
    borderColor: colors.primary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    maxWidth: 80,
  },
  selectedName: {
    color: colors.primary,
    fontWeight: '500',
  },
});