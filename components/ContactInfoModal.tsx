import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { X, Calendar } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/hooks/useAppStore';
import { User } from '@/types';
import { Input } from './Input';
import { Button } from './Button';

interface ContactInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ContactInfoModal({ visible, onClose }: ContactInfoModalProps) {
  const { t } = useTranslation();
  const { user, updateUserProfile } = useAppStore();
  
  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    email: user?.email || '',
    gender: user?.gender || '',
    birthday: user?.birthday || '',
    address: user?.address || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const updates: Partial<User> = {
        phone: formData.phone || undefined,
        email: formData.email,
        gender: formData.gender as 'male' | 'female' | 'other' || undefined,
        birthday: formData.birthday || undefined,
        address: formData.address || undefined,
      };
      
      await updateUserProfile(updates);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const showDatePicker = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'date';
      input.value = formData.birthday;
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, birthday: target.value }));
      };
      input.click();
    } else {
      Alert.prompt(
        t.profile.birthday,
        'Enter date (YYYY-MM-DD)',
        (text) => {
          if (text) {
            setFormData(prev => ({ ...prev, birthday: text }));
          }
        },
        'plain-text',
        formData.birthday
      );
    }
  };

  const showGenderPicker = () => {
    Alert.alert(
      t.profile.gender,
      'Select your gender',
      [
        { text: t.common.cancel, style: 'cancel' },
        { text: t.profile.male, onPress: () => setFormData(prev => ({ ...prev, gender: 'male' })) },
        { text: t.profile.female, onPress: () => setFormData(prev => ({ ...prev, gender: 'female' })) },
        { text: t.profile.other, onPress: () => setFormData(prev => ({ ...prev, gender: 'other' })) },
      ]
    );
  };

  const getGenderDisplayText = () => {
    switch (formData.gender) {
      case 'male': return t.profile.male;
      case 'female': return t.profile.female;
      case 'other': return t.profile.other;
      default: return 'Select gender';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t.profile.contactInfo}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.contactInfo}</Text>
            
            <Input
              label={t.auth.phone}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            
            <Input
              label={t.auth.email}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.profile.personalInfo}</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t.profile.gender}</Text>
              <TouchableOpacity style={styles.selectButton} onPress={showGenderPicker}>
                <Text style={[styles.selectButtonText, !formData.gender && styles.placeholder]}>
                  {getGenderDisplayText()}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t.profile.birthday}</Text>
              <TouchableOpacity style={styles.selectButton} onPress={showDatePicker}>
                <View style={styles.dateButtonContent}>
                  <Text style={[styles.selectButtonText, !formData.birthday && styles.placeholder]}>
                    {formData.birthday || 'Select birthday'}
                  </Text>
                  <Calendar size={20} color={colors.textSecondary} />
                </View>
              </TouchableOpacity>
            </View>
            
            <Input
              label={t.profile.address}
              value={formData.address}
              onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={t.common.save}
            onPress={handleSave}
            loading={isLoading}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  selectButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholder: {
    color: colors.textSecondary,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});