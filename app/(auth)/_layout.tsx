import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAppStore } from '@/hooks/useAppStore';

export default function AuthLayout() {
  const router = useRouter();
  const { isAuthenticated, isGuestMode } = useAppStore();
  
  useEffect(() => {
    // Redirect to tabs if already authenticated
    if (isAuthenticated || isGuestMode) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isGuestMode, router]);
  
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="register" options={{ title: 'Register' }} />
    </Stack>
  );
}