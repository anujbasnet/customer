import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

export default function PaymentSettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Settings</Text>
      <Text style={styles.desc}>This feature is coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 24 },
  title: { fontSize: 22, fontWeight: '600', color: colors.text, marginBottom: 8 },
  desc: { fontSize: 16, color: colors.textSecondary },
});