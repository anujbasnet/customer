import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link, useRouter } from "expo-router";
import { useAppStore } from "@/hooks/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { LanguageSelector } from "@/components/LanguageSelector";
import axios from "axios";

// backend URL (put it in .env later for flexibility)

const BASE_URL = process.env.EXPO_PUBLIC_SERVER_IP;
const API_URL = `https://${BASE_URL}/api/auth`;

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(""); // male, female, other
  const [birthday, setBirthday] = useState(null);
  const [address, setAddress] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { enterGuestMode } = useAppStore();
  const { t } = useTranslation();
  const router = useRouter();

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/register`, {
        email,
        password,
        role: "customer",
        phone,
        gender: gender || undefined,
        birthday: birthday ? birthday.toISOString().split("T")[0] : undefined,
        address,
        name: `${firstName} ${lastName}`,
      });

      if (res.data.msg === "User registered successfully") {
        router.replace("/(auth)/login");
      }
    } catch (err) {
      console.log(err.response?.data || err.message);
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestMode = () => {
    enterGuestMode();
    router.replace("/(tabs)");
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthday(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            label="First Name"
            placeholder="John"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
          />

          <Input
            label="Last Name"
            placeholder="Doe"
            value={lastName}
            onChangeText={setLastName}
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
              {["male", "female", "other"].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderButton,
                    gender === g && styles.genderButtonActive,
                  ]}
                  onPress={() => setGender(g)}
                >
                  <Text
                    style={[
                      styles.genderText,
                      gender === g && styles.genderTextActive,
                    ]}
                  >
                    {t.profile[g]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>{t.profile.birthday}</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={[styles.dateText, !birthday && styles.placeholderText]}
              >
                {birthday ? formatDate(birthday) : "Select date"}
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

          <TouchableOpacity
            style={styles.guestModeButton}
            onPress={handleGuestMode}
            activeOpacity={0.7}
          >
            <Text style={styles.guestModeText}>{t.auth.guestMode}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  scrollContent: { flexGrow: 1, padding: 20 },
  header: { alignItems: "center", marginTop: 60, marginBottom: 40 },
  languageContainer: { position: "absolute", top: -40, right: 0 },
  title: { fontSize: 28, fontWeight: "bold", color: colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: "center" },
  form: { width: "100%" },
  errorText: { color: colors.error, marginBottom: 16 },
  registerButton: { marginTop: 16, marginBottom: 24 },
  loginContainer: { flexDirection: "row", justifyContent: "center", marginTop: 16 },
  loginText: { color: colors.textSecondary, marginRight: 4 },
  loginLink: { color: colors.primary, fontWeight: "500" },
  fieldContainer: { marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "500", color: colors.text, marginBottom: 8 },
  genderContainer: { flexDirection: "row", gap: 8 },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  genderButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  genderText: { fontSize: 14, color: colors.text },
  genderTextActive: { color: "#FFFFFF", fontWeight: "500" },
  dateButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
  },
  dateText: { fontSize: 16, color: colors.text },
  placeholderText: { color: colors.textSecondary },
  guestModeButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "transparent",
    alignItems: "center",
  },
  guestModeText: { color: colors.textSecondary, fontSize: 16, fontWeight: "500" },
});
