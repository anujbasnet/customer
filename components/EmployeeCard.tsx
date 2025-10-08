import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';
import { Image } from 'expo-image';
import { Employee } from '@/types';
import { colors } from '@/constants/colors';

interface EmployeeCardProps {
  employee: Employee;
  selected?: boolean;
  onPress: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ 
  employee, 
  selected = false, 
  onPress 
}) => {
  const [broken, setBroken] = useState(false);
  const getInitial = (name?: string) => {
    if (!name || !name.trim()) return '?';
    return name.trim().charAt(0).toUpperCase();
  };
  const showImage = !!employee.image && !broken;
  return (
    <TouchableOpacity 
      style={[styles.card, selected && styles.selectedCard]}
      onPress={() => onPress(employee)}
      activeOpacity={0.7}
    >
      {showImage ? (
        <Image
          source={{ uri: employee.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
          onError={() => setBroken(true)}
        />
      ) : (
        <View style={[styles.image, styles.fallbackContainer]}>
          <Text style={styles.fallbackText}>{getInitial(employee.name)}</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={[styles.name, selected && styles.selectedText]}>
          {employee.name}
        </Text>
        <Text style={[styles.position, selected && styles.selectedText]}>
          {employee.position}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    width: 140,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  image: {
    width: '100%',
    height: 140,
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary + '22',
  },
  fallbackText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.primary,
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  position: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedText: {
    color: '#FFFFFF',
  },
});