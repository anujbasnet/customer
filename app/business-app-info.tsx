import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Globe, Smartphone, Play } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function BusinessAppInfoScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Try Rejaly Business App' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Rejaly Business</Text>
        <View style={styles.textContainer}>
          <Text style={styles.desc}>
            If you are offering similar services, we can help you find customers and manage bookings. Write to us at support@rejaly.uz and check our app.
          </Text>
          
          <View style={styles.linksContainer}>
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => Linking.openURL('https://rejaly.uz')} 
              testID="business-web-link"
              activeOpacity={0.7}
            >
              <Globe size={20} color={colors.primary} />
              <Text style={styles.linkText}>Open Web</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => Linking.openURL('https://apps.apple.com')} 
              testID="business-ios-link"
              activeOpacity={0.7}
            >
              <Smartphone size={20} color={colors.primary} />
              <Text style={styles.linkText}>App Store (iOS)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.linkItem}
              onPress={() => Linking.openURL('https://play.google.com/store')} 
              testID="business-android-link"
              activeOpacity={0.7}
            >
              <Play size={20} color={colors.primary} />
              <Text style={styles.linkText}>Play Store (Android)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  content: { 
    padding: 24 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: colors.text, 
    marginBottom: 16 
  },
  textContainer: { 
    flex: 1 
  },
  desc: { 
    fontSize: 15, 
    color: colors.text, 
    marginBottom: 24, 
    lineHeight: 22 
  },
  linksContainer: {
    gap: 16,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkText: { 
    marginLeft: 12,
    fontSize: 16,
    color: colors.primary, 
    fontWeight: '600' 
  },
});