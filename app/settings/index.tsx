import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Shield, CreditCard, ChevronRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

export default function SettingsScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t.settings.title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push('/settings/login-security')}
        activeOpacity={0.7}
        testID="login-security-item"
      >
        <View style={styles.itemLeft}>
          <Shield size={22} color={colors.primary} />
          <Text style={styles.itemTitle}>{t.settings.loginSecurity}</Text>
        </View>
        <ChevronRight size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push('/settings/payment')}
        activeOpacity={0.7}
        testID="payment-settings-item"
      >
        <View style={styles.itemLeft}>
          <CreditCard size={22} color={colors.primary} />
          <Text style={styles.itemTitle}>{t.settings.paymentSettings}</Text>
        </View>
        <ChevronRight size={18} color={colors.textSecondary} />
      </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemTitle: { marginLeft: 12, fontSize: 16, color: colors.text },
});