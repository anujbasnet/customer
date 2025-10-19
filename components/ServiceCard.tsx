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
import { useAppStore } from '@/hooks/useAppStore';

const darkColors = {
  background: "#121212",
  card: "#1E1E1E",
  border: "#2A2A2A",
  text: "#EAEAEA",
  textSecondary: "#A1A1A1",
  primary: "#3B82F6", // Tailwind blue-500 accent
};

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
  const { darkModeEnabled } = useAppStore();
  const theme = darkModeEnabled ? darkColors : colors;

  // Format price with thousand separators
  const formattedPrice = service.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const formattedOriginalPrice = service.originalPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: selected ? theme.primary : theme.border,
          shadowColor: darkModeEnabled ? '#000' : '#ccc',
        },
        selected && { backgroundColor: theme.primary + '22' },
      ]}
      onPress={() => onPress(service)}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text 
          style={[
            styles.name, 
            { color: selected ? theme.primary : theme.text }
          ]}
          numberOfLines={1}
        >
          {service.name}
        </Text>

        <Text 
          style={[
            styles.description, 
            { color: theme.textSecondary }
          ]}
          numberOfLines={2}
        >
          {service.description}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detail}>
            <Clock size={16} color={selected ? theme.primary : theme.textSecondary} />
            <Text 
              style={[
                styles.detailText, 
                { color: selected ? theme.primary : theme.textSecondary }
              ]}
            >
              {service.duration} min
            </Text>
          </View>

          <View style={styles.priceDetail}>
            <View style={styles.priceContainer}>
              {service.isPromotion && service.originalPrice ? (
                <>
                  <Text 
                    style={[
                      styles.originalPrice, 
                      { color: darkModeEnabled ? 'rgba(255,255,255,0.5)' : theme.textSecondary }
                    ]}
                  >
                    {formattedOriginalPrice} {currencySymbol}
                  </Text>
                  <Text 
                    style={[
                      styles.detailText, 
                      { color: selected ? theme.primary : theme.text }
                    ]}
                  >
                    {formattedPrice} {currencySymbol}
                  </Text>
                  <Text 
                    style={[
                      styles.promotionBadge, 
                      { color: selected ? theme.primary : theme.primary }
                    ]}
                  >
                    SPECIAL OFFER
                  </Text>
                </>
              ) : (
                <Text 
                  style={[
                    styles.detailText, 
                    { color: selected ? theme.primary : theme.text }
                  ]}
                >
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
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    marginLeft: 6,
  },
  priceDetail: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  promotionBadge: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: 0.3,
  },
});
