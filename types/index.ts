import { Language } from '@/constants/languages';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  cityId?: string;
  gender?: 'male' | 'female' | 'other';
  birthday?: string;
  address?: string;
}

export interface City {
  id: string;
  name: string;
  nameRu: string;
  nameUz: string;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  cityId: string;
  address: string;
  addressRu: string;
  addressUz: string;
  phone: string;
  email: string;
  description: string;
  descriptionRu: string;
  descriptionUz: string;
  rating: number;
  reviewCount: number;
  image: string;
  employees: Employee[];
  workingHours: WorkingHours;
  timeSlots: TimeSlot[];
  services: Service[];
  latitude: number;
  longitude: number;
  portfolio?: PortfolioItem[];
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  image: string;
}

export interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string | null;
  close: string | null;
}

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface Service {
  id: string;
  name: string;
  nameRu?: string;
  nameUz?: string;
  description: string;
  descriptionRu?: string;
  descriptionUz?: string;
  duration: number; // in minutes
  price: number;
  originalPrice?: number; // for promotional services
  isPromotion?: boolean;
  promotionId?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  description?: string;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  rating: number;
  reviewCount: number;
  image: string;
  services: Service[];
  portfolio?: PortfolioItem[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface Appointment {
  id: string;
  businessId: string;
  businessName: string;
  serviceId: string;
  serviceName: string;
  employeeId: string;
  employeeName: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface AppState {
  language: Language;
  setLanguage: (language: Language) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  selectedCity: string | null;
  setSelectedCity: (cityId: string | null) => void;
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
  favorites: Business[];
  addToFavorites: (business: Business) => void;
  removeFromFavorites: (businessId: string) => void;
  isFavorite: (businessId: string) => boolean;
  twoFactorEnabled: boolean;
  toggleTwoFactor: (enabled: boolean) => void;
  linkedAuthProviders: { google: boolean; facebook: boolean };
  linkProvider: (provider: 'google' | 'facebook') => void;
  unlinkProvider: (provider: 'google' | 'facebook') => void;
}