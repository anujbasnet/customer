import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { colors as baseColors } from "@/constants/colors";
import { useTranslation } from "@/hooks/useTranslation";
import { useAppStore } from "@/hooks/useAppStore";
import appJson from "../app.json";

export default function AboutScreen() {
  const { t } = useTranslation();
  const { darkModeEnabled } = useAppStore();
  const version: string = (appJson as any).expo?.version ?? "1.0.0";

  const colors = {
    background: darkModeEnabled ? "#121212" : "#FFFFFF",
    text: darkModeEnabled ? "#FFFFFF" : "#000000",
    textSecondary: darkModeEnabled ? "#AAAAAA" : "#6B7280",
    primary: baseColors.primary,
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: t.about.title,
          headerStyle: {
            backgroundColor: darkModeEnabled ? "#121212" : "#FFFFFF",
          },
          headerTintColor: darkModeEnabled ? "#FFFFFF" : "#000000",
          headerTitleStyle: { fontWeight: "600" },
        }}
      />

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t.about.appTitle}
        </Text>
        <Text style={[styles.desc, { color: colors.textSecondary }]}>
          {t.about.description}
        </Text>
        <Text style={[styles.version, { color: colors.textSecondary }]}>
          {t.about.version}: {version}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  desc: { fontSize: 16, marginBottom: 16 },
  version: { fontSize: 14 },
});
