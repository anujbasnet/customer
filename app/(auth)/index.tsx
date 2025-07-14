import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAppStore } from '@/hooks/useAppStore';

export default function AuthIndex() {
  const { isAuthenticated } = useAppStore();
  
  // Redirect to the appropriate screen based on authentication status
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  
  return <Redirect href="/login" />;
}