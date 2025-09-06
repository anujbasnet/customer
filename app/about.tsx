import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import appJson from '../app.json';

export default function AboutScreen() {
  const { t } = useTranslation();
  const version: string = (appJson as any).expo?.version ?? '1.0.0';

  return (
    <>
      <Stack.Screen options={{ title: t.about.title }} />
      <View style={styles.container}>
        <Text style={styles.title}>{t.about.appTitle}</Text>
        <Text style={styles.desc}>
          {t.about.description}
        </Text>
        <Text style={styles.version}>{t.about.version}: {version}</Text>
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