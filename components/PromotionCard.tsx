import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Image } from 'expo-image';
import { Tag, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { Promotion } from '@/mocks/promotions';

interface PromotionCardProps {
  promotion: Promotion;
  onPress: (promotion: Promotion) => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, onPress }) => {
  const { t } = useTranslation();
  const { darkModeEnabled } = useAppStore();

  const bgColor = darkModeEnabled ? "#1E1E1E" : colors.card;
  const textColor = darkModeEnabled ? "#FFFFFF" : colors.text;
  const secondaryTextColor = darkModeEnabled ? "#B0B0B0" : colors.textSecondary;
  const categoryBg = darkModeEnabled ? "#2A2A2A" : colors.background;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePress = () => {
    onPress(promotion);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: bgColor }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: promotion.image }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.overlay}>
        <View style={[styles.discountBadge, { backgroundColor: colors.error }]}>
          <Text style={styles.discountText}>{promotion.discount}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={2}>{promotion.title}</Text>
        <Text style={[styles.businessName, { color: colors.primary }]}>{promotion.businessName}</Text>
        <Text style={[styles.description, { color: secondaryTextColor }]} numberOfLines={2}>{promotion.description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.validUntil}>
            <Calendar size={14} color={secondaryTextColor} />
            <Text style={[styles.validText, { color: secondaryTextColor }]}>
              Valid until {formatDate(promotion.validUntil)}
            </Text>
          </View>
          <View style={[styles.categoryTag, { backgroundColor: categoryBg }]}>
            <Tag size={12} color={colors.primary} />
            <Text style={[styles.categoryText, { color: colors.primary }]}>
              {t.categories[promotion.category as keyof typeof t.categories]}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
    height: 120,
  },
  overlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  discountBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  businessName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  validUntil: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  validText: {
    fontSize: 12,
    marginLeft: 4,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
});
