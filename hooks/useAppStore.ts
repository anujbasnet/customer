import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/constants/languages';
import { AppState, User, Business } from '@/types';

// Mock authentication functions
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email && password) {
    return {
      id: '1',
      name: 'John Doe',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      cityId: '1' // Default to Tashkent
    };
  }
  
  throw new Error('Invalid credentials');
};

const mockRegister = async (
  name: string, 
  email: string, 
  password: string, 
  additionalInfo?: {
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    birthday?: string;
    address?: string;
  }
): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (name && email && password) {
    return {
      id: '1',
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      cityId: '1', // Default to Tashkent
      ...additionalInfo
    };
  }
  
  throw new Error('Registration failed');
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'en' as Language,
      setLanguage: (language: Language) => set({ language }),
      user: null,
      setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
      isAuthenticated: false,
      selectedCity: '1', // Default to Tashkent
      setSelectedCity: (cityId: string | null) => set({ selectedCity: cityId }),
      login: async (email: string, password: string): Promise<void> => {
        try {
          const user = await mockLogin(email, password);
          set({ user, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      register: async (
        name: string, 
        email: string, 
        password: string, 
        additionalInfo?: {
          phone?: string;
          gender?: 'male' | 'female' | 'other';
          birthday?: string;
          address?: string;
        }
      ): Promise<void> => {
        try {
          const user = await mockRegister(name, email, password, additionalInfo);
          set({ user, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },
      updateUserProfile: async (updates: Partial<User>): Promise<void> => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = { ...currentUser, ...updates };
          set({ user: updatedUser });
        }
      },
      favorites: [],
      addToFavorites: (business: Business) => {
        const currentFavorites = get().favorites;
        if (!currentFavorites.find((fav: Business) => fav.id === business.id)) {
          set({ favorites: [...currentFavorites, business] });
        }
      },
      removeFromFavorites: (businessId: string) => {
        const currentFavorites = get().favorites;
        set({ favorites: currentFavorites.filter((fav: Business) => fav.id !== businessId) });
      },
      isFavorite: (businessId: string): boolean => {
        const currentFavorites = get().favorites;
        return currentFavorites.some((fav: Business) => fav.id === businessId);
      },
    }),
    {
      name: 'timely-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);