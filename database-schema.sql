-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ru TEXT NOT NULL,
  name_uz TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  avatar TEXT,
  city_id UUID REFERENCES cities(id),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  birthday DATE,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) NOT NULL,
  city_id UUID REFERENCES cities(id) NOT NULL,
  address TEXT NOT NULL,
  address_ru TEXT NOT NULL,
  address_uz TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  description TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  description_uz TEXT NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  image TEXT NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  working_hours JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  name_ru TEXT,
  name_uz TEXT,
  description TEXT NOT NULL,
  description_ru TEXT,
  description_uz TEXT,
  duration INTEGER NOT NULL, -- in minutes
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, date, time)
);

-- Create promotions table
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_businesses_category_id ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_city_id ON businesses(city_id);
CREATE INDEX IF NOT EXISTS idx_businesses_rating ON businesses(rating DESC);
CREATE INDEX IF NOT EXISTS idx_employees_business_id ON employees(business_id);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_time_slots_business_id ON time_slots(business_id);
CREATE INDEX IF NOT EXISTS idx_time_slots_date ON time_slots(date);
CREATE INDEX IF NOT EXISTS idx_promotions_business_id ON promotions(business_id);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Cities
INSERT INTO cities (id, name, name_ru, name_uz) VALUES
('1', 'Tashkent', 'Ташкент', 'Toshkent'),
('2', 'Samarkand', 'Самарканд', 'Samarqand'),
('3', 'Bukhara', 'Бухара', 'Buxoro')
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO categories (id, name, icon, image) VALUES
('1', 'Beauty & Spa', 'Sparkles', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('2', 'Barbershop', 'Scissors', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('3', 'Fitness', 'Dumbbell', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('4', 'Healthcare', 'Heart', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('5', 'Auto Service', 'Car', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('6', 'Education', 'GraduationCap', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- Sample businesses
INSERT INTO businesses (id, name, category_id, city_id, address, address_ru, address_uz, phone, email, description, description_ru, description_uz, rating, review_count, image, latitude, longitude, working_hours) VALUES
('1', 'Elite Barbers', '2', '1', '123 Main Street', '123 Главная улица', '123 Asosiy ko''cha', '+998901234567', 'info@elitebarbers.uz', 'Premium barbershop with experienced stylists', 'Премиум парикмахерская с опытными стилистами', 'Tajribali stilistlar bilan premium sartaroshxona', 4.8, 156, 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 41.2995, 69.2401, '{"monday": {"open": "09:00", "close": "20:00"}, "tuesday": {"open": "09:00", "close": "20:00"}, "wednesday": {"open": "09:00", "close": "20:00"}, "thursday": {"open": "09:00", "close": "20:00"}, "friday": {"open": "09:00", "close": "20:00"}, "saturday": {"open": "10:00", "close": "18:00"}, "sunday": {"open": null, "close": null}}'),
('2', 'Luxury Spa Center', '1', '1', '456 Beauty Avenue', '456 Проспект Красоты', '456 Go''zallik prospekti', '+998901234568', 'info@luxuryspa.uz', 'Full-service spa with relaxing treatments', 'Полный спектр спа-услуг с расслабляющими процедурами', 'Dam olish muolajalari bilan to''liq xizmat spa markazi', 4.9, 203, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 41.3111, 69.2797, '{"monday": {"open": "08:00", "close": "21:00"}, "tuesday": {"open": "08:00", "close": "21:00"}, "wednesday": {"open": "08:00", "close": "21:00"}, "thursday": {"open": "08:00", "close": "21:00"}, "friday": {"open": "08:00", "close": "21:00"}, "saturday": {"open": "09:00", "close": "19:00"}, "sunday": {"open": "10:00", "close": "18:00"}}')
ON CONFLICT (id) DO NOTHING;

-- Sample employees
INSERT INTO employees (id, business_id, name, position, image) VALUES
('1', '1', 'John Smith', 'Senior Barber', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
('2', '1', 'Mike Johnson', 'Hair Stylist', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
('3', '2', 'Sarah Wilson', 'Spa Therapist', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'),
('4', '2', 'Emma Davis', 'Massage Therapist', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

-- Sample services
INSERT INTO services (id, business_id, name, name_ru, name_uz, description, description_ru, description_uz, duration, price) VALUES
('1', '1', 'Classic Haircut', 'Классическая стрижка', 'Klassik soch olish', 'Professional haircut with styling', 'Профессиональная стрижка с укладкой', 'Styling bilan professional soch olish', 45, 50000),
('2', '1', 'Beard Trim', 'Стрижка бороды', 'Soqol olish', 'Precise beard trimming and shaping', 'Точная стрижка и формирование бороды', 'Aniq soqol olish va shakllantirish', 30, 30000),
('3', '2', 'Full Body Massage', 'Массаж всего тела', 'To''liq tana massaji', 'Relaxing full body massage therapy', 'Расслабляющий массаж всего тела', 'Dam beruvchi to''liq tana massaj terapiyasi', 90, 150000),
('4', '2', 'Facial Treatment', 'Уход за лицом', 'Yuz parvarishi', 'Deep cleansing facial with moisturizing', 'Глубокая очистка лица с увлажнением', 'Namlovchi bilan chuqur yuz tozalash', 60, 80000)
ON CONFLICT (id) DO NOTHING;

-- Sample promotions
INSERT INTO promotions (id, business_id, title, description, discount_percentage, valid_from, valid_until, is_active) VALUES
('1', '1', '30% Off All Services', 'Get 30% discount on all barbershop services', 30, '2025-01-01', '2025-02-28', true),
('2', '2', 'Spa Package Deal', 'Special discount on spa packages', 25, '2025-01-01', '2025-03-31', true)
ON CONFLICT (id) DO NOTHING;

-- Sample time slots (generate for next 30 days)
INSERT INTO time_slots (business_id, date, time, is_available)
SELECT 
  b.id as business_id,
  (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 29)) as date,
  (time '09:00:00' + INTERVAL '1 hour' * generate_series(0, 10)) as time,
  true as is_available
FROM businesses b
WHERE b.id IN ('1', '2')
ON CONFLICT (business_id, date, time) DO NOTHING;