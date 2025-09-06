const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bmgmoygwnscrllwmdbul.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtZ21veWd3bnNjcmxsd21kYnVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDAyODU3MywiZXhwIjoyMDY5NjA0NTczfQ.PEBp9KcOgTrQyraK6-x4xDfsisDLn00NZvj4hmdufuU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Mock data
const cities = [
  { id: '1', name: 'Tashkent', nameRu: 'Ташкент', nameUz: 'Toshkent' },
  { id: '2', name: 'Samarkand', nameRu: 'Самарканд', nameUz: 'Samarqand' },
  { id: '3', name: 'Nurobod', nameRu: 'Нурабад', nameUz: 'Nurobod' }
];

const categories = [
  { id: '1', name: 'hairSalon', icon: 'scissors', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: '2', name: 'barber', icon: 'scissors', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: '3', name: 'nailSalon', icon: 'paintbrush', image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'football', icon: 'football', image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: '5', name: 'spa', icon: 'flower2', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: '6', name: 'massage', icon: 'hand', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: '7', name: 'dental', icon: 'smile', image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
  { id: '8', name: 'fitness', icon: 'dumbbell', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
];

const businesses = [
  {
    id: '1',
    name: 'Elite Barbers',
    category: 'barber',
    cityId: '1',
    address: '12 Amir Temur Avenue, Tashkent',
    addressRu: 'Проспект Амира Темура 12, Ташкент',
    addressUz: 'Amir Temur shoh ko\'chasi 12, Toshkent',
    phone: '+998 90 123 4567',
    email: 'info@elitebarbers.uz',
    description: 'Premium barbershop offering classic and modern haircuts and beard grooming.',
    descriptionRu: 'Премиум барбершоп, предлагающий классические и современные стрижки и уход за бородой.',
    descriptionUz: 'Premium sartaroshxona klassik va zamonaviy soch turmagi va soqol parvarishi xizmatlarini taqdim etadi.',
    rating: 4.8,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    latitude: 41.2995,
    longitude: 69.2401,
    workingHours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    employees: [
      { id: '101', name: 'Rustam Karimov', position: 'Master Barber', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
      { id: '102', name: 'Jasur Toshmatov', position: 'Senior Barber', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
    ],
    services: [
      { id: '1001', name: 'Haircut', nameRu: 'Стрижка', nameUz: 'Soch olish', description: 'Classic men\'s haircut with styling', descriptionRu: 'Классическая мужская стрижка с укладкой', descriptionUz: 'Klassik erkaklar soch turmagi uslublash bilan', duration: 30, price: 80000 },
      { id: '1002', name: 'Beard Trim', nameRu: 'Стрижка бороды', nameUz: 'Soqol olish', description: 'Professional beard trimming and shaping', descriptionRu: 'Профессиональная стрижка и моделирование бороды', descriptionUz: 'Professional soqol olish va shakllantirish', duration: 20, price: 50000 },
      { id: '1003', name: 'Hot Towel Shave', nameRu: 'Бритье с горячим полотенцем', nameUz: 'Issiq sochiq bilan soqol olish', description: 'Traditional hot towel straight razor shave', descriptionRu: 'Традиционное бритье опасной бритвой с горячим полотенцем', descriptionUz: 'An\'anaviy issiq sochiq bilan to\'g\'ri ustara soqol olish', duration: 45, price: 100000 }
    ]
  },
  {
    id: '2',
    name: 'Modern Cuts',
    category: 'barber',
    cityId: '1',
    address: '45 Shota Rustaveli Street, Tashkent',
    addressRu: 'Улица Шота Руставели 45, Ташкент',
    addressUz: 'Shota Rustaveli ko\'chasi 45, Toshkent',
    phone: '+998 90 234 5678',
    email: 'info@moderncuts.uz',
    description: 'Contemporary barbershop specializing in trendy haircuts and styling.',
    descriptionRu: 'Современный барбершоп, специализирующийся на модных стрижках и укладках.',
    descriptionUz: 'Zamonaviy sartaroshxona, zamonaviy soch turmagi va uslublashga ixtisoslashgan.',
    rating: 4.7,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    latitude: 41.3111,
    longitude: 69.2797,
    workingHours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '10:00', close: '19:00' },
      sunday: { open: '11:00', close: '17:00' }
    },
    employees: [
      { id: '201', name: 'Bobur Alimov', position: 'Master Barber', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
      { id: '202', name: 'Timur Rakhimov', position: 'Barber', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
    ],
    services: [
      { id: '2001', name: 'Trendy Haircut', nameRu: 'Модная стрижка', nameUz: 'Zamonaviy soch turmagi', description: 'Modern haircut with the latest trends', descriptionRu: 'Современная стрижка по последним тенденциям', descriptionUz: 'Eng so\'nggi tendentsiyalar bo\'yicha zamonaviy soch turmagi', duration: 45, price: 100000 },
      { id: '2002', name: 'Fade Haircut', nameRu: 'Стрижка фейд', nameUz: 'Feyd soch turmagi', description: 'Specialized fade haircut with precision', descriptionRu: 'Специализированная стрижка фейд с точностью', descriptionUz: 'Aniqlik bilan maxsus feyd soch turmagi', duration: 40, price: 90000 },
      { id: '2003', name: 'Hair & Beard Combo', nameRu: 'Комбо стрижка волос и бороды', nameUz: 'Soch va soqol kombinatsiyasi', description: 'Complete hair and beard styling package', descriptionRu: 'Полный пакет стрижки волос и бороды', descriptionUz: 'To\'liq soch va soqol uslublash paketi', duration: 60, price: 130000 }
    ]
  },
  {
    id: '3',
    name: 'Glamour Salon',
    category: 'hairSalon',
    cityId: '1',
    address: '78 Buyuk Ipak Yuli, Tashkent',
    addressRu: 'Улица Буюк Ипак Йули 78, Ташкент',
    addressUz: 'Buyuk Ipak Yo\'li 78, Toshkent',
    phone: '+998 90 345 6789',
    email: 'info@glamoursalon.uz',
    description: 'Upscale hair salon offering a full range of hair services for women and men.',
    descriptionRu: 'Элитный салон красоты, предлагающий полный спектр услуг по уходу за волосами для женщин и мужчин.',
    descriptionUz: 'Ayollar va erkaklar uchun soch parvarishi bo\'yicha to\'liq xizmatlar doirasini taklif etuvchi yuqori darajadagi salon.',
    rating: 4.9,
    reviewCount: 203,
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    latitude: 41.3111,
    longitude: 69.2797,
    workingHours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '19:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: null, close: null }
    },
    employees: [
      { id: '301', name: 'Malika Usmanova', position: 'Hair Stylist', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
    ],
    services: [
      { id: '3001', name: 'Women\'s Haircut', nameRu: 'Женская стрижка', nameUz: 'Ayollar soch turmagi', description: 'Professional haircut with consultation', descriptionRu: 'Профессиональная стрижка с консультацией', descriptionUz: 'Maslahat bilan professional soch turmagi', duration: 60, price: 150000 },
      { id: '3002', name: 'Hair Coloring', nameRu: 'Окрашивание волос', nameUz: 'Soch bo\'yash', description: 'Full hair coloring service with premium products', descriptionRu: 'Полное окрашивание волос с использованием премиум-продуктов', descriptionUz: 'Premium mahsulotlar bilan to\'liq soch bo\'yash xizmati', duration: 120, price: 300000 },
      { id: '3003', name: 'Blowout & Styling', nameRu: 'Укладка и стайлинг', nameUz: 'Soch quritish va uslublash', description: 'Professional blow dry and styling', descriptionRu: 'Профессиональная сушка и укладка', descriptionUz: 'Professional soch quritish va uslublash', duration: 45, price: 120000 }
    ],
    portfolio: [
      { id: 'g1', title: 'Elegant Updo Styling', image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', description: 'Beautiful updo hairstyles for special occasions' },
      { id: 'g2', title: 'Modern Hair Coloring', image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', description: 'Professional hair coloring with premium products' },
      { id: 'g3', title: 'Stylish Haircuts', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80', description: 'Modern and trendy haircut styles' }
    ]
  },
  {
    id: '4',
    name: 'Polished Nails',
    category: 'nailSalon',
    cityId: '1',
    address: '23 Mirzo Ulugbek Street, Tashkent',
    addressRu: 'Улица Мирзо Улугбека 23, Ташкент',
    addressUz: 'Mirzo Ulug\'bek ko\'chasi 23, Toshkent',
    phone: '+998 90 456 7890',
    email: 'info@polishednails.uz',
    description: 'Specialized nail salon offering manicures, pedicures, and nail art.',
    descriptionRu: 'Специализированный салон ногтей, предлагающий маникюр, педикюр и нейл-арт.',
    descriptionUz: 'Manikür, pedikür va tirnoq san\'atini taklif etuvchi ixtisoslashtirilgan tirnoq saloni.',
    rating: 4.6,
    reviewCount: 178,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    latitude: 41.2995,
    longitude: 69.2401,
    workingHours: {
      monday: { open: '10:00', close: '20:00' },
      tuesday: { open: '10:00', close: '20:00' },
      wednesday: { open: '10:00', close: '20:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '20:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: null, close: null }
    },
    employees: [
      { id: '401', name: 'Nilufar Azimova', position: 'Nail Technician', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }
    ],
    services: [
      { id: '4001', name: 'Classic Manicure', nameRu: 'Классический маникюр', nameUz: 'Klassik manikür', description: 'Basic manicure with polish', descriptionRu: 'Базовый маникюр с покрытием', descriptionUz: 'Oddiy manikür lak bilan', duration: 45, price: 80000 },
      { id: '4002', name: 'Gel Nails', nameRu: 'Гель-лак', nameUz: 'Gel tirnoqlar', description: 'Long-lasting gel nail application', descriptionRu: 'Долговременное гелевое покрытие', descriptionUz: 'Uzoq muddatli gel tirnoq qoplama', duration: 60, price: 120000 },
      { id: '4003', name: 'Pedicure', nameRu: 'Педикюр', nameUz: 'Pedikür', description: 'Relaxing pedicure with polish', descriptionRu: 'Расслабляющий педикюр с покрытием', descriptionUz: 'Dam olish pedikür lak bilan', duration: 60, price: 100000 }
    ]
  }
];

const promotions = [
  { id: '1', title: '30% Off First Visit', description: 'Get 30% discount on your first haircut at Elite Barbers', discount: '30%', businessId: '1', businessName: 'Elite Barbers', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', validUntil: '2024-12-31', category: 'barber' },
  { id: '2', title: 'Free Manicure with Pedicure', description: 'Book a pedicure and get a basic manicure absolutely free', discount: 'Free Service', businessId: '4', businessName: 'Polished Nails', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', validUntil: '2024-11-30', category: 'nailSalon' },
  { id: '3', title: 'Spa Day Package', description: 'Complete spa experience with massage, facial and relaxation', discount: '25%', businessId: '5', businessName: 'Zen Spa', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', validUntil: '2024-12-15', category: 'spa' },
  { id: '4', title: 'Student Discount', description: '20% off all services for students with valid ID', discount: '20%', businessId: '6', businessName: 'Silk Road Salon', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', validUntil: '2024-12-31', category: 'hairSalon' }
];

const categoryNameMap = {
  'hairSalon': '1',
  'barber': '2', 
  'nailSalon': '3',
  'football': '4',
  'spa': '5',
  'massage': '6',
  'dental': '7',
  'fitness': '8'
};

async function populateSupabase() {
  console.log('Starting Supabase population...');

  try {
    // 1. Insert cities
    console.log('Inserting cities...');
    const { error: citiesError } = await supabase
      .from('cities')
      .upsert(cities.map(city => ({
        id: city.id,
        name: city.name,
        name_ru: city.nameRu,
        name_uz: city.nameUz
      })), { onConflict: 'id' });
    
    if (citiesError) {
      console.error('Error inserting cities:', citiesError);
      return;
    }
    console.log('Cities inserted successfully');

    // 2. Insert categories
    console.log('Inserting categories...');
    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories.map(category => ({
        id: category.id,
        name: category.name,
        icon: category.icon,
        image: category.image
      })), { onConflict: 'id' });
    
    if (categoriesError) {
      console.error('Error inserting categories:', categoriesError);
      return;
    }
    console.log('Categories inserted successfully');

    // 3. Insert businesses
    console.log('Inserting businesses...');
    const businessesData = businesses.map(business => ({
      id: business.id,
      name: business.name,
      category_id: categoryNameMap[business.category] || business.category,
      city_id: business.cityId,
      address: business.address,
      address_ru: business.addressRu,
      address_uz: business.addressUz,
      phone: business.phone,
      email: business.email,
      description: business.description,
      description_ru: business.descriptionRu,
      description_uz: business.descriptionUz,
      rating: business.rating,
      review_count: business.reviewCount,
      image: business.image,
      latitude: business.latitude,
      longitude: business.longitude,
      working_hours: business.workingHours
    }));

    const { error: businessesError } = await supabase
      .from('businesses')
      .upsert(businessesData, { onConflict: 'id' });
    
    if (businessesError) {
      console.error('Error inserting businesses:', businessesError);
      return;
    }
    console.log('Businesses inserted successfully');

    // 4. Insert employees
    console.log('Inserting employees...');
    const employeesData = businesses.flatMap(business => 
      business.employees.map(employee => ({
        id: employee.id,
        business_id: business.id,
        name: employee.name,
        position: employee.position,
        image: employee.image
      }))
    );

    const { error: employeesError } = await supabase
      .from('employees')
      .upsert(employeesData, { onConflict: 'id' });
    
    if (employeesError) {
      console.error('Error inserting employees:', employeesError);
      return;
    }
    console.log('Employees inserted successfully');

    // 5. Insert services
    console.log('Inserting services...');
    const servicesData = businesses.flatMap(business => 
      business.services.map(service => ({
        id: service.id,
        business_id: business.id,
        name: service.name,
        name_ru: service.nameRu || null,
        name_uz: service.nameUz || null,
        description: service.description,
        description_ru: service.descriptionRu || null,
        description_uz: service.descriptionUz || null,
        duration: service.duration,
        price: service.price
      }))
    );

    const { error: servicesError } = await supabase
      .from('services')
      .upsert(servicesData, { onConflict: 'id' });
    
    if (servicesError) {
      console.error('Error inserting services:', servicesError);
      return;
    }
    console.log('Services inserted successfully');

    // 6. Insert portfolio items
    console.log('Inserting portfolio items...');
    const portfolioData = businesses.flatMap(business => 
      (business.portfolio || []).map(item => ({
        id: item.id,
        business_id: business.id,
        title: item.title,
        image: item.image,
        description: item.description || null
      }))
    );

    if (portfolioData.length > 0) {
      const { error: portfolioError } = await supabase
        .from('portfolio_items')
        .upsert(portfolioData, { onConflict: 'id' });
      
      if (portfolioError) {
        console.error('Error inserting portfolio items:', portfolioError);
        return;
      }
      console.log('Portfolio items inserted successfully');
    }

    // 7. Insert promotions
    console.log('Inserting promotions...');
    const promotionsData = promotions.map(promotion => {
      const discountPercentage = parseInt(promotion.discount.replace('%', '')) || 0;
      return {
        id: promotion.id,
        business_id: promotion.businessId,
        title: promotion.title,
        description: promotion.description,
        discount_percentage: discountPercentage,
        valid_from: '2025-01-01',
        valid_until: promotion.validUntil,
        is_active: true
      };
    });

    const { error: promotionsError } = await supabase
      .from('promotions')
      .upsert(promotionsData, { onConflict: 'id' });
    
    if (promotionsError) {
      console.error('Error inserting promotions:', promotionsError);
      return;
    }
    console.log('Promotions inserted successfully');

    // 8. Generate time slots for next 30 days
    console.log('Generating time slots...');
    const timeSlots = [];
    const today = new Date();
    
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
      const date = new Date(today);
      date.setDate(today.getDate() + dayOffset);
      const dateString = date.toISOString().split('T')[0];
      
      for (const business of businesses) {
        // Generate slots from 9 AM to 6 PM with 1-hour intervals
        for (let hour = 9; hour < 18; hour++) {
          const timeString = `${hour.toString().padStart(2, '0')}:00:00`;
          timeSlots.push({
            business_id: business.id,
            date: dateString,
            time: timeString,
            is_available: Math.random() > 0.3 // 70% chance of being available
          });
        }
      }
    }

    // Insert time slots in batches to avoid timeout
    const batchSize = 1000;
    for (let i = 0; i < timeSlots.length; i += batchSize) {
      const batch = timeSlots.slice(i, i + batchSize);
      const { error: timeSlotsError } = await supabase
        .from('time_slots')
        .upsert(batch, { onConflict: 'business_id,date,time' });
      
      if (timeSlotsError) {
        console.error('Error inserting time slots batch:', timeSlotsError);
        return;
      }
      console.log(`Time slots batch ${Math.floor(i / batchSize) + 1} inserted`);
    }
    console.log('Time slots generated successfully');

    console.log('✅ Supabase population completed successfully!');
  } catch (error) {
    console.error('❌ Error populating Supabase:', error);
  }
}

populateSupabase();