import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";
import { LocationProvider } from "@/hooks/useLocationStore";

import { ErrorBoundary } from "./error-boundary";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a client with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on network errors after 2 attempts
        if (failureCount >= 2) return false;
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) return false;
        return true;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <LocationProvider>
          <ErrorBoundary>
            <RootLayoutNav />
          </ErrorBoundary>
        </LocationProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="provider/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="booking/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="appointment/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="category/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="business/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: true }} />
      <Stack.Screen name="map" options={{ headerShown: true }} />
      <Stack.Screen name="booking-confirmed" options={{ headerShown: true }} />
      <Stack.Screen name="settings/index" options={{ headerShown: true }} />
      <Stack.Screen name="settings/login-security" options={{ headerShown: true }} />
      <Stack.Screen name="settings/payment" options={{ headerShown: true }} />
      <Stack.Screen name="help-support" options={{ headerShown: true }} />
      <Stack.Screen name="about" options={{ headerShown: true }} />
      <Stack.Screen name="business-app-info" options={{ headerShown: true }} />
      <Stack.Screen name="my-reviews" options={{ headerShown: true }} />
      <Stack.Screen name="edit-credentials" options={{ headerShown: true }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: true }} />
    </Stack>
  );
}