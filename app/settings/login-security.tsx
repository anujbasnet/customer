import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, Alert, ScrollView, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAppStore } from '@/hooks/useAppStore';

export default function LoginSecurityScreen() {
  const { user, updateUserProfile, twoFactorEnabled, toggleTwoFactor, linkedAuthProviders, linkProvider, unlinkProvider } = useAppStore();
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const handleSaveEmail = () => {
    if (!email.includes('@')) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    updateUserProfile({ email });
    Alert.alert('Updated', 'Email updated successfully.');
  };

  const handleChangePassword = () => {
    if (newPassword.length < 6) {
      Alert.alert('Weak password', 'Use at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Mismatch', 'New password and confirmation do not match.');
      return;
    }
    Alert.alert('Updated', 'Password changed successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Login & Security' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Login Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          testID="email-input"
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveEmail} testID="save-email">
          <Text style={styles.buttonText}>Save Email</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          testID="current-password"
        />
        <TextInput
          style={styles.input}
          placeholder="New password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          testID="new-password"
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          testID="confirm-password"
        />
        <TouchableOpacity style={styles.button} onPress={handleChangePassword} testID="save-password">
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
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
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12, fontSize: 15, color: colors.text },
  button: { backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  secondaryButton: { backgroundColor: '#F1F5F9', paddingVertical: 10, borderRadius: 10, alignItems: 'center', paddingHorizontal: 16 },
  secondaryButtonText: { color: colors.text, fontSize: 14, fontWeight: '600' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  helpText: { fontSize: 13, color: colors.textSecondary, marginTop: 8 },
  providerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  providerLabel: { fontSize: 15, color: colors.text },
});