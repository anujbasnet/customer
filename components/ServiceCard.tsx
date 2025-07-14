import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  View 
} from 'react-native';
import { Clock, DollarSign } from 'lucide-react-native';
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
          <View style={styles.detail}>
            <DollarSign size={16} color={selected ? '#FFFFFF' : colors.textSecondary} />
            <Text style={[styles.detailText, selected && styles.selectedText]}>
              {formattedPrice} {currencySymbol}
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
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});