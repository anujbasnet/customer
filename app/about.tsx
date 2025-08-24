import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import appJson from '../app.json';

export default function AboutScreen() {
  const version: string = (appJson as any).expo?.version ?? '1.0.0';

  return (
    <>
      <Stack.Screen options={{ title: 'About' }} />
      <View style={styles.container}>
        <Text style={styles.title}>About Rejaly.uz</Text>
        <Text style={styles.desc}>
          Rejaly.uz helps you discover nearby beauty and wellness services, compare providers, and book appointments seamlessly.
        </Text>
        <Text style={styles.version}>App version: {version}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 8 },
  desc: { fontSize: 16, color: colors.textSecondary, marginBottom: 16 },
  version: { fontSize: 14, color: colors.textSecondary },
});