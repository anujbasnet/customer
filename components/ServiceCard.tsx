import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Clock } from 'lucide-react-native';
import { Service } from '@/types';
import { colors } from '@/constants/colors';

interface ServiceCardProps {
  service: Service;
  selected?: boolean;
  onPress: (service: Service) => void;
  currencySymbol?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  selected = false, 
  onPress,
  currencySymbol = 'UZS'
}) => {
  // Format price to include thousands separators
  const formattedPrice = service.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const formattedOriginalPrice = service.originalPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  
  return (
    <TouchableOpacity 
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onPress(service)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={[styles.name, selected && styles.selectedText]}>
          {service.name}
        </Text>
        <Text style={[styles.description, selected && styles.selectedText]}>
          {service.description}
        </Text>
        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Clock size={16} color={selected ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.detailText, selected && styles.selectedText]}>
              {service.duration} min
            </Text>
          </View>
          <View style={styles.priceDetail}>
            <View style={styles.priceContainer}>
              {service.isPromotion && service.originalPrice ? (
                <>
                  <Text style={[styles.originalPrice, selected && styles.selectedOriginalPrice]}>
                    {formattedOriginalPrice} {currencySymbol}
                  </Text>
                  <Text style={[styles.detailText, selected && styles.selectedText]}>
                    {formattedPrice} {currencySymbol}
                  </Text>
                  <Text style={[styles.promotionBadge, selected && styles.selectedPromotionBadge]}>
                    SPECIAL OFFER
                  </Text>
                </>
              ) : (
                <Text style={[styles.detailText, selected && styles.selectedText]}>
                  {formattedPrice} {currencySymbol}
                </Text>
              )}
            </View>
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
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectedText: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 4,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  selectedOriginalPrice: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  promotionBadge: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  selectedPromotionBadge: {
    color: '#FFFFFF',
  },
});