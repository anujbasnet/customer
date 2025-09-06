import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for frontend (with anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Admin client for backend operations (with service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          avatar: string | null;
          city_id: string | null;
          gender: 'male' | 'female' | 'other' | null;
          birthday: string | null;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          phone?: string | null;
          avatar?: string | null;
          city_id?: string | null;
          gender?: 'male' | 'female' | 'other' | null;
          birthday?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          avatar?: string | null;
          city_id?: string | null;
          gender?: 'male' | 'female' | 'other' | null;
          birthday?: string | null;
          address?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cities: {
        Row: {
          id: string;
          name: string;
          name_ru: string;
          name_uz: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          name_ru: string;
          name_uz: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          name_ru?: string;
          name_uz?: string;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          image: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon: string;
          image: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          image?: string;
          created_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          city_id: string;
          address: string;
          address_ru: string;
          address_uz: string;
          phone: string;
          email: string;
          description: string;
          description_ru: string;
          description_uz: string;
          rating: number;
          review_count: number;
          image: string;
          latitude: number;
          longitude: number;
          working_hours: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          city_id: string;
          address: string;
          address_ru: string;
          address_uz: string;
          phone: string;
          email: string;
          description: string;
          description_ru: string;
          description_uz: string;
          rating?: number;
          review_count?: number;
          image: string;
          latitude: number;
          longitude: number;
          working_hours?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          city_id?: string;
          address?: string;
          address_ru?: string;
          address_uz?: string;
          phone?: string;
          email?: string;
          description?: string;
          description_ru?: string;
          description_uz?: string;
          rating?: number;
          review_count?: number;
          image?: string;
          latitude?: number;
          longitude?: number;
          working_hours?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      employees: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          position: string;
          image: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          position: string;
          image: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          position?: string;
          image?: string;
          created_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          name_ru: string | null;
          name_uz: string | null;
          description: string;
          description_ru: string | null;
          description_uz: string | null;
          duration: number;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          name_ru?: string | null;
          name_uz?: string | null;
          description: string;
          description_ru?: string | null;
          description_uz?: string | null;
          duration: number;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          name_ru?: string | null;
          name_uz?: string | null;
          description?: string;
          description_ru?: string | null;
          description_uz?: string | null;
          duration?: number;
          price?: number;
          created_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          user_id: string;
          business_id: string;
          service_id: string;
          employee_id: string;
          date: string;
          time: string;
          duration: number;
          price: number;
          discount_amount: number | null;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_id: string;
          service_id: string;
          employee_id: string;
          date: string;
          time: string;
          duration: number;
          price: number;
          discount_amount?: number | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_id?: string;
          service_id?: string;
          employee_id?: string;
          date?: string;
          time?: string;
          duration?: number;
          price?: number;
          discount_amount?: number | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      portfolio_items: {
        Row: {
          id: string;
          business_id: string;
          title: string;
          image: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          title: string;
          image: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          title?: string;
          image?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      time_slots: {
        Row: {
          id: string;
          business_id: string;
          date: string;
          time: string;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          date: string;
          time: string;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          date?: string;
          time?: string;
          is_available?: boolean;
          created_at?: string;
        };
      };
      promotions: {
        Row: {
          id: string;
          business_id: string;
          title: string;
          description: string;
          discount_percentage: number;
          valid_from: string;
          valid_until: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          title: string;
          description: string;
          discount_percentage: number;
          valid_from: string;
          valid_until: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          title?: string;
          description?: string;
          discount_percentage?: number;
          valid_from?: string;
          valid_until?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
      user_favorites: {
        Row: {
          id: string;
          user_id: string;
          business_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          business_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          business_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}