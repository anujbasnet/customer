import { Redirect } from 'expo-router';

export default function Index() {
  // Always redirect to tabs, regardless of authentication status
  return <Redirect href="/(tabs)" />;
}