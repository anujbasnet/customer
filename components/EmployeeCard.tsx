import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Employee } from '@/types';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';

const darkColors = {
  background: "#121212",
  card: "#1E1E1E",
  border: "#2A2A2A",
  text: "#EAEAEA",
  textSecondary: "#A1A1A1",
  primary: "#3B82F6", // Tailwind blue-500 for accent
};

interface EmployeeCardProps {
  employee: Employee;
  selected?: boolean;
  onPress: (employee: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  selected = false,
  onPress,
}) => {
  const [broken, setBroken] = useState(false);
  const { darkModeEnabled } = useAppStore();

  const getInitial = (name?: string) => {
    if (!name || !name.trim()) return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  const showImage = !!employee.image && !broken;

  const theme = darkModeEnabled ? darkColors : colors;

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
      onPress={() => onPress(employee)}
      activeOpacity={0.8}
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
        <View
          style={[
            styles.image,
            styles.fallbackContainer,
            { backgroundColor: theme.primary + '33' },
          ]}
        >
          <Text style={[styles.fallbackText, { color: theme.primary }]}>
            {getInitial(employee.name)}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <Text
          style={[
            styles.name,
            { color: selected ? theme.primary : theme.text },
          ]}
          numberOfLines={1}
        >
          {employee.name}
        </Text>
        <Text
          style={[
            styles.position,
            { color: selected ? theme.text : theme.textSecondary },
          ]}
          numberOfLines={1}
        >
          {employee.position}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
    width: 140,
    borderWidth: 1,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 42,
    fontWeight: '700',
  },
  content: {
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  position: {
    fontSize: 13,
    fontWeight: '400',
  },
});
