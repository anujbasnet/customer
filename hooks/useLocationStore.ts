import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';

interface LocationState {
  location: Location.LocationObject | null;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<void>;
  getCurrentLocation: () => Promise<void>;
}

export const [LocationProvider, useLocation] = createContextHook(() => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (Platform.OS === 'web') {
        // For web, use browser geolocation API
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser');
        }
        
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        });
        
        const webLocation: Location.LocationObject = {
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
          },
          timestamp: position.timestamp,
        };
        
        setLocation(webLocation);
        setHasPermission(true);
      } else {
        // For mobile, use expo-location
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          throw new Error('Location permission denied');
        }
        
        setHasPermission(true);
        await getCurrentLocation();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location permission');
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    if (!hasPermission && Platform.OS !== 'web') {
      await requestPermission();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      if (Platform.OS === 'web') {
        await requestPermission();
      } else {
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(currentLocation);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get current location');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't request permission automatically to avoid blocking app startup
  // useEffect(() => {
  //   requestPermission();
  // }, []);

  return {
    location,
    hasPermission,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
  };
});