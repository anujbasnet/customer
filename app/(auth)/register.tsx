import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Link, useRouter } from 'expo-router';
import { useAppStore } from '@/hooks/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [address, setAddress] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAppStore();
  const { t } = useTranslation();
  const router = useRouter();
  
  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Please fill required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await register(name, email, password, {
        phone,
        gender: gender || undefined,
        birthday: birthday?.toISOString().split('T')[0],
        address
      });
      router.replace('/(tabs)');
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.languageContainer}>
            <LanguageSelector />
          </View>
          <Text style={styles.title}>{t.auth.register}</Text>
          <Text style={styles.subtitle}>{t.home.title}</Text>
        </View>
        
        <View style={styles.form}>
          <Input
            label={t.auth.name}
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          
          <Input
            label={t.auth.email}
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          
          <Input
            label={t.auth.password}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Input
            label={t.auth.phone}
            placeholder="+998 90 123 45 67"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t.profile.gender}</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'male' && styles.genderButtonActive]}
                onPress={() => setGender('male')}
              >
                <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>
                  {t.profile.male}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'female' && styles.genderButtonActive]}
                onPress={() => setGender('female')}
              >
                <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>
                  {t.profile.female}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'other' && styles.genderButtonActive]}
                onPress={() => setGender('other')}
              >
                <Text style={[styles.genderText, gender === 'other' && styles.genderTextActive]}>
                  {t.profile.other}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t.profile.birthday}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateText, !birthday && styles.placeholderText]}>
                {birthday ? formatDate(birthday) : 'Select date'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showDatePicker && (
            <DateTimePicker
              value={birthday || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
          
          <Input
            label={t.profile.address}
            placeholder="Street, City, Country"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={2}
          />
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          <Button
            title={t.auth.register}
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />
          
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t.auth.hasAccount}</Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>{t.auth.login}</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  languageContainer: {
    position: 'absolute',
    top: -40,
    right: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginText: {
    color: colors.textSecondary,
    marginRight: 4,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: '500',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: {
    fontSize: 14,
    color: colors.text,
  },
  genderTextActive: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
});