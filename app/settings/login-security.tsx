import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';
import { Edit3 } from 'lucide-react-native';

export default function LoginSecurityScreen() {
  const { user, twoFactorEnabled, toggleTwoFactor, linkedAuthProviders, linkProvider, unlinkProvider } = useAppStore();
  const router = useRouter();

  const handleEditCredentials = () => {
    router.push('/edit-credentials');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Login & Security' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Login Credentials</Text>
        
        <View style={styles.credentialRow}>
          <View style={styles.credentialInfo}>
            <Text style={styles.credentialLabel}>Login</Text>
            <Text style={styles.credentialValue}>{user?.email || user?.phone || 'user@example.com'}</Text>
          </View>
        </View>
        
        <View style={styles.credentialRow}>
          <View style={styles.credentialInfo}>
            <Text style={styles.credentialLabel}>Password</Text>
            <Text style={styles.credentialValue}>••••••••</Text>
          </View>
        </View>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditCredentials} testID="edit-credentials">
            <Edit3 size={16} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.forgotButton} onPress={handleForgotPassword} testID="forgot-password">
            <Text style={styles.forgotButtonText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>Two-step verification</Text>
          <Switch
            value={twoFactorEnabled}
            onValueChange={(v) => toggleTwoFactor(v)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={Platform.OS === 'android' ? '#FFFFFF' : undefined}
            testID="twofactor-switch"
          />
        </View>
        <Text style={styles.helpText}>Add extra security for your account.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Other login options</Text>
        <View style={styles.providerRow}>
          <Text style={styles.providerLabel}>Google</Text>
          {linkedAuthProviders.google ? (
            <TouchableOpacity style={styles.secondaryButton} onPress={() => unlinkProvider('google')} testID="unlink-google">
              <Text style={styles.secondaryButtonText}>Unlink</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => linkProvider('google')} testID="link-google">
              <Text style={styles.buttonText}>Link</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.providerRow}>
          <Text style={styles.providerLabel}>Facebook</Text>
          {linkedAuthProviders.facebook ? (
            <TouchableOpacity style={styles.secondaryButton} onPress={() => unlinkProvider('facebook')} testID="unlink-facebook">
              <Text style={styles.secondaryButtonText}>Unlink</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => linkProvider('facebook')} testID="link-facebook">
              <Text style={styles.buttonText}>Link</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  credentialRow: { marginBottom: 16 },
  credentialInfo: { marginBottom: 8 },
  credentialLabel: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  credentialValue: { fontSize: 16, color: colors.text, fontWeight: '500' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  editButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9FF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.primary },
  editButtonText: { color: colors.primary, fontSize: 14, fontWeight: '600', marginLeft: 6 },
  forgotButton: { paddingVertical: 8, paddingHorizontal: 16 },
  forgotButtonText: { color: colors.primary, fontSize: 14, textDecorationLine: 'underline' },
  button: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  secondaryButton: { backgroundColor: '#F1F5F9', paddingVertical: 10, borderRadius: 10, alignItems: 'center', paddingHorizontal: 16 },
  secondaryButtonText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  helpText: { fontSize: 13, color: colors.textSecondary, marginTop: 8 },
  providerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  providerLabel: { fontSize: 15, color: colors.text },
});