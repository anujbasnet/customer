import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors as baseColors } from '@/constants/colors';
import { useAppStore } from "@/hooks/useAppStore";

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  leftIcon?: React.ReactElement;
  darkMode?: boolean; // NEW: pass true for dark mode
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  inputStyle,
  labelStyle,
  leftIcon, // default false
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const {darkModeEnabled} = useAppStore(); // Assume this comes from a global theme context or similar
  const bgColor = darkModeEnabled ? '#1E1E1E' : '#FFFFFF';
  const textColor = darkModeEnabled ? '#FFFFFF' : '#000000';
  const placeholderColor = darkModeEnabled ? '#AAAAAA' : '#6B7280';
  const borderColor = darkModeEnabled ? '#333333' : '#E5E7EB';

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: textColor }, labelStyle]}>{label}</Text>}
      <View style={[
        styles.inputContainer,
        { backgroundColor: bgColor, borderColor },
        error ? styles.inputError : null,
        multiline ? { height: numberOfLines * 24 } : null
      ]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: textColor },
            inputStyle,
            leftIcon && { paddingLeft: 8 },
            secureTextEntry && { paddingRight: 40 }
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholderTextColor={placeholderColor}
        />
        {secureTextEntry && (
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showPassword ? <EyeOff size={20} color={placeholderColor} /> : <Eye size={20} color={placeholderColor} />}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      android: { elevation: 1 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
    }),
  },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 12, fontSize: 16 },
  inputError: { borderColor: '#FF3B30' },
  errorText: { color: '#FF3B30', fontSize: 12, marginTop: 4 },
  eyeIcon: { position: 'absolute', right: 12 },
  leftIcon: { paddingLeft: 12, alignItems: 'center', justifyContent: 'center' },
});
