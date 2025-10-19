import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking, Alert, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { colors as baseColors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';

export default function HelpSupportScreen() {
  const { t } = useTranslation();
  const { darkModeEnabled } = useAppStore();

  const [title, setTitle] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [contacts, setContacts] = useState<string>('');

  const colors = {
    background: darkModeEnabled ? '#121212' : '#FFFFFF',
    text: darkModeEnabled ? '#FFFFFF' : '#000000',
    textSecondary: darkModeEnabled ? '#AAAAAA' : '#6B7280',
    border: darkModeEnabled ? '#333333' : '#E5E7EB',
    primary: baseColors.primary,
    buttonText: '#FFFFFF',
    secondaryButtonBackground: darkModeEnabled ? '#1E1E1E' : '#F1F5F9',
    secondaryButtonText: darkModeEnabled ? '#FFFFFF' : '#000000',
  };

  const handleSend = () => {
    if (!title || !details || !contacts) {
      Alert.alert(t.helpSupport.missingInfo, t.helpSupport.missingInfoMessage);
      return;
    }
    Alert.alert(t.helpSupport.sent, t.helpSupport.sentMessage);
    setTitle('');
    setDetails('');
    setContacts('');
  };

  return (
    <>
        <Stack.Screen
              options={{
                title: t.helpSupport.title,
                headerStyle: {
                  backgroundColor: darkModeEnabled ? "#121212" : "#FFFFFF",
                },
                headerTintColor: darkModeEnabled ? "#FFFFFF" : "#000000",
                headerTitleStyle: { fontWeight: "600" },
              }}
            />
      
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{t.helpSupport.howCanWeHelp}</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{t.helpSupport.subtitle}</Text>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => Linking.openURL('mailto:help@rejaly.uz')} testID="email-help">
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>{t.helpSupport.emailHelp}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: colors.secondaryButtonBackground }]} onPress={() => Linking.openURL('https://t.me/rejaly_support')} testID="telegram-chat">
            <Text style={[styles.secondaryButtonText, { color: colors.secondaryButtonText }]}>{t.helpSupport.telegramChat}</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.formLabel, { color: colors.text }]}>{t.helpSupport.writeHere}</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder={t.helpSupport.titlePlaceholder}
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
          testID="hs-title"
        />
        <TextInput
          style={[styles.input, styles.textarea, { borderColor: colors.border, color: colors.text }]}
          placeholder={t.helpSupport.detailsPlaceholder}
          placeholderTextColor={colors.textSecondary}
          value={details}
          onChangeText={setDetails}
          multiline
          numberOfLines={5}
          testID="hs-details"
        />
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder={t.helpSupport.contactsPlaceholder}
          placeholderTextColor={colors.textSecondary}
          value={contacts}
          onChangeText={setContacts}
          testID="hs-contacts"
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleSend} testID="hs-send">
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>{t.helpSupport.send}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  buttonText: { fontWeight: '700' },
  secondaryButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  secondaryButtonText: { fontWeight: '700' },
  formLabel: { fontSize: 16, fontWeight: '600', marginVertical: 12 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12, fontSize: 15 },
  textarea: { height: 120, textAlignVertical: 'top' },
});
