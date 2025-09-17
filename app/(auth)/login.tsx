import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAppStore } from "@/hooks/useAppStore";
import { useTranslation } from "@/hooks/useTranslation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors } from "@/constants/colors";
import { LanguageSelector } from "@/components/LanguageSelector";
import { auth } from "@/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, enterGuestMode } = useAppStore();
  const { t } = useTranslation();
  const router = useRouter();

  // const handleLogin = async () => {

  //   setError('');

  //   try {
  //     await login(email, password);
  //     router.replace('/(tabs)');
  //   } catch (err) {
  //     setError('Invalid email or password');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const signIn = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("/(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  const handleGuestMode = () => {
    enterGuestMode();
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <View style={styles.languageContainer}>
            <LanguageSelector />
          </View>
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              }}
              style={styles.logo}
            />
          </View>
          <Text style={styles.title}>{t.common.appName}</Text>
          <Text style={styles.subtitle}>{t.home.title}</Text>
        </View>

        <View style={styles.form}>
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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => router.push("/forgot-password")}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.forgotPasswordText}>
              {t.auth.forgotPassword}
            </Text>
          </TouchableOpacity>

          <Button
            title={t.auth.login}
            onPress={signIn}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>{t.auth.noAccount}</Text>
            <Link href="/register" asChild>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.registerLink}>{t.auth.register}</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  languageContainer: {
    position: "absolute",
    top: -20,
    right: 0,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  form: {
    width: "100%",
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  registerText: {
    color: colors.textSecondary,
    marginRight: 4,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: "500",
  },
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
  guestModeText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },
});
