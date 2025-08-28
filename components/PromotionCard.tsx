import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Image } from 'expo-image';
import { Tag, Calendar } from 'lucide-react-native';
import { Promotion } from '@/mocks/promotions';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

interface PromotionCardProps {
  promotion: Promotion;
  onPress: (promotion: Promotion) => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, onPress }) => {
  const { t } = useTranslation();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handlePress = () => {
    // Navigate to booking with promotion ID
    onPress(promotion);
  };
  
  return (
    <TouchableOpacity 
      style={styles.card}
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
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{promotion.discount}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{promotion.title}</Text>
        <Text style={styles.businessName}>{promotion.businessName}</Text>
        <Text style={styles.description} numberOfLines={2}>{promotion.description}</Text>
        
        <View style={styles.footer}>
          <View style={styles.validUntil}>
            <Calendar size={14} color={colors.textSecondary} />
            <Text style={styles.validText}>Valid until {formatDate(promotion.validUntil)}</Text>
          </View>
          <View style={styles.categoryTag}>
            <Tag size={12} color={colors.primary} />
            <Text style={styles.categoryText}>
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
    height: 120,
  },
  overlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  discountBadge: {
    backgroundColor: colors.error,
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
    color: colors.text,
    marginBottom: 4,
  },
  businessName: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
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
    color: colors.textSecondary,
    marginLeft: 4,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
});