import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/constants/languages';
import { User, Business } from '@/types';

// 👇 Define AppState inline to avoid typing issues
interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;

  user: User | null;
  setUser?: (user: User | null) => void;
  isAuthenticated: boolean;
  isGuestMode: boolean;

  selectedCity: string | null;
  setSelectedCity: (cityId: string | null) => void;

  darkModeEnabled: boolean;
  setDarkModeEnabled: (enabled: boolean) => void;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  enterGuestMode: () => void;
  register: (
    name: string,
    email: string,
    password: string,
    additionalInfo?: {
      phone?: string;
      gender?: 'male' | 'female' | 'other';
      birthday?: string;
      address?: string;
    }
  ) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;

  twoFactorEnabled: boolean;
  toggleTwoFactor: (enabled: boolean) => void;

  linkedAuthProviders: { google: boolean; facebook: boolean };
  linkProvider: (provider: 'google' | 'facebook') => void;
  unlinkProvider: (provider: 'google' | 'facebook') => void;

  favorites: Business[];
  addToFavorites: (business: Business) => void;
  removeFromFavorites: (businessId: string) => void;
  isFavorite: (businessId: string) => boolean;
}

// ---- Mock backend calls ----
const mockLogin = async (email: string, password: string): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (!email || !password) throw new Error('Invalid credentials');
  return {
    id: '1',
    name: 'John Doe',
    email,
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cityId: '1',
  };
};

const mockRegister = async (
  name: string,
  email: string,
  password: string,
  additionalInfo?: any
): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: '1',
    name,
    email,
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    cityId: '1',
    ...additionalInfo,
  };
};

// ---- Zustand Store ----
export const useAppStore = create<AppState>()(
  persist<AppState>(
    (set, get) => ({
      language: 'en' as Language,
      setLanguage: (language) => set({ language }),

      user: null,
      isAuthenticated: false,
      isGuestMode: false,

      selectedCity: '1',
      setSelectedCity: (cityId) => set({ selectedCity: cityId }),

      darkModeEnabled: false,
      setDarkModeEnabled: (enabled) => set({ darkModeEnabled: enabled }),

      login: async (email, password) => {
        const user = await mockLogin(email, password);
        set({ user, isAuthenticated: true, isGuestMode: false });
      },

      logout: () => set({ user: null, isAuthenticated: false, isGuestMode: false }),

      enterGuestMode: () =>
        set({ isGuestMode: true, isAuthenticated: true, user: null }),

      register: async (name, email, password, additionalInfo) => {
        const user = await mockRegister(name, email, password, additionalInfo);
        set({ user, isAuthenticated: true, isGuestMode: false });
      },

      updateUserProfile: async (updates) => {
        const user = get().user;
        if (user) set({ user: { ...user, ...updates } });
      },

      twoFactorEnabled: false,
      toggleTwoFactor: (enabled) => set({ twoFactorEnabled: enabled }),

      linkedAuthProviders: { google: false, facebook: false },
      linkProvider: (provider) => {
        const linked = get().linkedAuthProviders;
        set({ linkedAuthProviders: { ...linked, [provider]: true } });
      },
      unlinkProvider: (provider) => {
        const linked = get().linkedAuthProviders;
        set({ linkedAuthProviders: { ...linked, [provider]: false } });
      },

      favorites: [],
      addToFavorites: (business) => {
        const favs = get().favorites;
        if (!favs.find((f) => f.id === business.id)) {
          set({ favorites: [...favs, business] });
        }
      },
      removeFromFavorites: (id) => {
        const favs = get().favorites;
        set({ favorites: favs.filter((f) => f.id !== id) });
      },
      isFavorite: (id) => get().favorites.some((f) => f.id === id),
    }),
    {
      name: 'rejaly-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
