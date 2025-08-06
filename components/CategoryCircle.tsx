import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View
} from 'react-native';

import { 
  Scissors, 
  Paintbrush, 
  Bookmark, 
  Flower2, 
  Hand, 
  Smile, 
  Dumbbell
} from 'lucide-react-native';
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
  const { t, language } = useTranslation();
  
  const getCategoryName = () => {
    if (category.id === 'all') {
      if (language === 'ru') return 'Все';
      if (language === 'uz') return 'Hammasi';
      return 'All';
    }
    return t.categories[category.name as keyof typeof t.categories] || category.name;
  };
  
  const getCategoryIcon = () => {
    const iconSize = 32;
    const iconColor = selected ? '#FFFFFF' : colors.primary;
    
    switch (category.icon) {
      case 'scissors':
        return <Scissors size={iconSize} color={iconColor} />;
      case 'paintbrush':
        return <Paintbrush size={iconSize} color={iconColor} />;
      case 'football':
        return <Bookmark size={iconSize} color={iconColor} />;
      case 'flower2':
        return <Flower2 size={iconSize} color={iconColor} />;
      case 'hand':
        return <Hand size={iconSize} color={iconColor} />;
      case 'smile':
        return <Smile size={iconSize} color={iconColor} />;
      case 'dumbbell':
        return <Dumbbell size={iconSize} color={iconColor} />;
      default:
        return <Scissors size={iconSize} color={iconColor} />;
    }
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
        selected && styles.selectedIconContainer
      ]}>
        {getCategoryIcon()}
      </View>
      <Text style={[
        styles.name, 
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
    backgroundColor: colors.card,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIconContainer: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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