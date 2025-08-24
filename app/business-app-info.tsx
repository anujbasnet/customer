import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { colors } from '@/constants/colors';

export default function BusinessAppInfoScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Try Rejaly Business App' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Rejaly Business</Text>
      <View style={styles.row}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1593702207404-1bad1076d2d3?q=80&w=1887&auto=format&fit=crop' }}
          style={styles.image}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.desc}>
            If you are offering similar services, we can help you find customers and manage bookings. Write to us at support@rejaly.uz and check our app.
          </Text>
          <View style={styles.linksRow}>
            <TouchableOpacity onPress={() => Linking.openURL('https://rejaly.uz')} testID="business-web-link">
              <Text style={styles.linkText}>Open Web</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://apps.apple.com')} testID="business-ios-link">
              <Text style={styles.linkText}>App Store</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://play.google.com/store')} testID="business-android-link">
              <Text style={styles.linkText}>Play Store</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.qrRow}>
            <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://apps.apple.com' }} style={styles.qr} />
            <Image source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://play.google.com/store' }} style={styles.qr} />
          </View>
        </View>
      </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 12 },
  row: { flexDirection: 'row' },
  image: { width: 120, height: 120, borderRadius: 12 },
  desc: { fontSize: 15, color: colors.text, marginBottom: 12 },
  linksRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  linkText: { marginRight: 16, color: colors.primary, fontWeight: '700' },
  qrRow: { flexDirection: 'row' },
  qr: { width: 100, height: 100, marginRight: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
});