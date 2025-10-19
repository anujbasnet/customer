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
  darkModeEnabled?: boolean; // ✅ Add dark mode prop
}

export const CategoryCircle: React.FC<CategoryCircleProps> = ({ 
  category, 
  onPress,
  selected = false,
  darkModeEnabled = false
}) => {
  const { t, language } = useTranslation();
  
  const getCategoryName = () => {
    if (category.id === 'all') {
      if (language === 'ru') return 'Все';
      if (language === 'uz') return 'Hammasi';
      return 'All';
    }
    return t.categories[category.name as keyof typeof t.categories] || category.name;
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
      hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
    >
      <View style={[
        styles.iconContainer,
        {
          backgroundColor: selected 
            ? colors.primary 
            : darkModeEnabled 
              ? '#1E1E1E' 
              : colors.card,
          borderColor: selected 
            ? colors.primary 
            : darkModeEnabled 
              ? '#333' 
              : colors.border,
        },
        selected && styles.selectedIconContainer
      ]}>
        <Image
          source={{ uri: category.image }}
          style={styles.categoryImage}
          contentFit="cover"
        />
        {selected && <View style={styles.selectedOverlay} />}
      </View>
      <Text style={[
        styles.name, 
        { color: darkModeEnabled ? '#FFFFFF' : colors.text },
        selected && styles.selectedName
      ]} numberOfLines={1}>
        {getCategoryName()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
  },
  selectedIconContainer: {
    borderWidth: 2,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 80,
  },
  selectedName: {
    color: colors.primary,
    fontWeight: '500',
  },
});
