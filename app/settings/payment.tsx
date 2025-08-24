import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function PaymentSettingsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Payment Settings' }} />
      <View style={styles.container}>
        <Text style={styles.desc}>This feature is coming soon.</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 24 },
  desc: { fontSize: 16, color: colors.textSecondary },
});