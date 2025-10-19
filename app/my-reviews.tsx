import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors as baseColors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { Star } from 'lucide-react-native';
import { useAppStore } from '@/hooks/useAppStore';

export default function MyReviewsScreen() {
  const { t } = useTranslation();
  const { darkModeEnabled } = useAppStore();

  const colors = {
    background: darkModeEnabled ? '#121212' : '#FFFFFF',
    text: darkModeEnabled ? '#FFFFFF' : '#000000',
    textSecondary: darkModeEnabled ? '#AAAAAA' : '#6B7280',
    primary: baseColors.primary,
    iconBackground: darkModeEnabled ? '#1E1E1E' : '#F0F9FF',
  };

  return (
    <>
        <Stack.Screen
              options={{
                title: t.myReviews.title,
                headerStyle: {
                  backgroundColor: darkModeEnabled ? "#121212" : "#FFFFFF",
                },
                headerTintColor: darkModeEnabled ? "#FFFFFF" : "#000000",
                headerTitleStyle: { fontWeight: "600" },
              }}
            />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: colors.iconBackground }]}>
            <Star size={64} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{t.myReviews.comingSoon}</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {t.myReviews.description}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
