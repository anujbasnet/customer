import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Linking, Alert, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';

export default function HelpSupportScreen() {
  const { t } = useTranslation();
  const [title, setTitle] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [contacts, setContacts] = useState<string>('');

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
      <Stack.Screen options={{ title: t.helpSupport.title }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t.helpSupport.howCanWeHelp}</Text>
      <Text style={styles.subtitle}>{t.helpSupport.subtitle}</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('mailto:help@rejaly.uz')} testID="email-help">
          <Text style={styles.buttonText}>{t.helpSupport.emailHelp}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => Linking.openURL('https://t.me/rejaly_support')} testID="telegram-chat">
          <Text style={styles.secondaryButtonText}>{t.helpSupport.telegramChat}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.formLabel}>{t.helpSupport.writeHere}</Text>
      <TextInput
        style={styles.input}
        placeholder={t.helpSupport.titlePlaceholder}
        value={title}
        onChangeText={setTitle}
        testID="hs-title"
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder={t.helpSupport.detailsPlaceholder}
        value={details}
        onChangeText={setDetails}
        multiline
        numberOfLines={5}
        testID="hs-details"
      />
      <TextInput
        style={styles.input}
        placeholder={t.helpSupport.contactsPlaceholder}
        value={contacts}
        onChangeText={setContacts}
        testID="hs-contacts"
      />
      <TouchableOpacity style={styles.button} onPress={handleSend} testID="hs-send">
        <Text style={styles.buttonText}>{t.helpSupport.send}</Text>
      </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 8, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  button: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
  secondaryButton: { backgroundColor: '#F1F5F9', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  secondaryButtonText: { color: colors.text, fontWeight: '700' },
  formLabel: { fontSize: 16, fontWeight: '600', color: colors.text, marginVertical: 12 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12, fontSize: 15, color: colors.text },
  textarea: { height: 120, textAlignVertical: 'top' },
});