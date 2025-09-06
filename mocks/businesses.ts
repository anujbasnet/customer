import { Business, TimeSlot } from '@/types';

// Helper function to generate time slots
const generateTimeSlots = (
  startHour: number, 
  endHour: number, 
  interval: number = 30, 
  excludedSlots: string[] = []
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      if (!excludedSlots.includes(timeString)) {
        slots.push({
          id: `slot-${timeString}`,
          time: timeString,
          isAvailable: Math.random() > 0.3 // 70% chance of being available
        });
      }
    }
  }
  
  return slots;
};

export const businesses: Business[] = [
  // Tashkent businesses
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
    employees: [
      {
        id: '101',
        name: 'Rustam Karimov',
        position: 'Master Barber',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: '102',
        name: 'Jasur Toshmatov',
        position: 'Senior Barber',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    workingHours: {
      monday: { open: '09:00', close: '20:00' },
      tuesday: { open: '09:00', close: '20:00' },
      wednesday: { open: '09:00', close: '20:00' },
      thursday: { open: '09:00', close: '20:00' },
      friday: { open: '09:00', close: '20:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '10:00', close: '16:00' }
    },
    timeSlots: generateTimeSlots(9, 20, 30, ['13:00', '13:30']),
    latitude: 41.2995,
    longitude: 69.2401,
    services: [
      {
        id: '1001',
        name: 'Haircut',
        nameRu: 'Стрижка',
        nameUz: 'Soch olish',
        description: 'Classic men\'s haircut with styling',
        descriptionRu: 'Классическая мужская стрижка с укладкой',
        descriptionUz: 'Klassik erkaklar soch turmagi uslublash bilan',
        duration: 30,
        price: 80000
      },
      {
        id: '1002',
        name: 'Beard Trim',
        nameRu: 'Стрижка бороды',
        nameUz: 'Soqol olish',
        description: 'Professional beard trimming and shaping',
        descriptionRu: 'Профессиональная стрижка и моделирование бороды',
        descriptionUz: 'Professional soqol olish va shakllantirish',
        duration: 20,
        price: 50000
      },
      {
        id: '1003',
        name: 'Hot Towel Shave',
        nameRu: 'Бритье с горячим полотенцем',
        nameUz: 'Issiq sochiq bilan soqol olish',
        description: 'Traditional hot towel straight razor shave',
        descriptionRu: 'Традиционное бритье опасной бритвой с горячим полотенцем',
        descriptionUz: 'An\'anaviy issiq sochiq bilan to\'g\'ri ustara soqol olish',
        duration: 45,
        price: 100000
      },
      {
        id: '1004',
        name: 'Premium Haircut - 30% Off',
        nameRu: 'Премиум стрижка - скидка 30%',
        nameUz: 'Premium soch turmagi - 30% chegirma',
        description: 'Premium haircut with styling - Special 30% discount for first visit',
        descriptionRu: 'Премиум стрижка с укладкой - Специальная скидка 30% для первого визита',
        descriptionUz: 'Premium soch turmagi uslublash bilan - Birinchi tashrif uchun maxsus 30% chegirma',
        duration: 45,
        price: 84000,
        originalPrice: 120000,
        isPromotion: true,
        promotionId: '1'
      }
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
    employees: [
      {
        id: '201',
        name: 'Bobur Alimov',
        position: 'Master Barber',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: '202',
        name: 'Timur Rakhimov',
        position: 'Barber',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    workingHours: {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '10:00', close: '19:00' },
      sunday: { open: '11:00', close: '17:00' }
    },
    timeSlots: generateTimeSlots(10, 21, 30, ['14:00', '14:30']),
    latitude: 41.3111,
    longitude: 69.2797,
    services: [
      {
        id: '2001',
        name: 'Trendy Haircut',
        nameRu: 'Модная стрижка',
        nameUz: 'Zamonaviy soch turmagi',
        description: 'Modern haircut with the latest trends',
        descriptionRu: 'Современная стрижка по последним тенденциям',
        descriptionUz: 'Eng so\'nggi tendentsiyalar bo\'yicha zamonaviy soch turmagi',
        duration: 45,
        price: 100000
      },
      {
        id: '2002',
        name: 'Fade Haircut',
        nameRu: 'Стрижка фейд',
        nameUz: 'Feyd soch turmagi',
        description: 'Specialized fade haircut with precision',
        descriptionRu: 'Специализированная стрижка фейд с точностью',
        descriptionUz: 'Aniqlik bilan maxsus feyd soch turmagi',
        duration: 40,
        price: 90000
      },
      {
        id: '2003',
        name: 'Hair & Beard Combo',
        nameRu: 'Комбо стрижка волос и бороды',
        nameUz: 'Soch va soqol kombinatsiyasi',
        description: 'Complete hair and beard styling package',
        descriptionRu: 'Полный пакет стрижки волос и бороды',
        descriptionUz: 'To\'liq soch va soqol uslublash paketi',
        duration: 60,
        price: 130000
      }
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
    employees: [
      {
        id: '301',
        name: 'Malika Usmanova',
        position: 'Hair Stylist',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    workingHours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '19:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: null, close: null }
    },
    timeSlots: generateTimeSlots(9, 19, 60, ['13:00']),
    latitude: 41.3111,
    longitude: 69.2797,
    services: [
      {
        id: '3001',
        name: 'Women\'s Haircut',
        nameRu: 'Женская стрижка',
        nameUz: 'Ayollar soch turmagi',
        description: 'Professional haircut with consultation',
        descriptionRu: 'Профессиональная стрижка с консультацией',
        descriptionUz: 'Maslahat bilan professional soch turmagi',
        duration: 60,
        price: 150000
      },
      {
        id: '3002',
        name: 'Hair Coloring',
        nameRu: 'Окрашивание волос',
        nameUz: 'Soch bo\'yash',
        description: 'Full hair coloring service with premium products',
        descriptionRu: 'Полное окрашивание волос с использованием премиум-продуктов',
        descriptionUz: 'Premium mahsulotlar bilan to\'liq soch bo\'yash xizmati',
        duration: 120,
        price: 300000
      },
      {
        id: '3003',
        name: 'Blowout & Styling',
        nameRu: 'Укладка и стайлинг',
        nameUz: 'Soch quritish va uslublash',
        description: 'Professional blow dry and styling',
        descriptionRu: 'Профессиональная сушка и укладка',
        descriptionUz: 'Professional soch quritish va uslublash',
        duration: 45,
        price: 120000
      }
    ],
    portfolio: [
      {
        id: 'g1',
        title: 'Elegant Updo Styling',
        image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        description: 'Beautiful updo hairstyles for special occasions'
      },
      {
        id: 'g2',
        title: 'Modern Hair Coloring',
        image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        description: 'Professional hair coloring with premium products'
      },
      {
        id: 'g3',
        title: 'Stylish Haircuts',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
        description: 'Modern and trendy haircut styles'
      }
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
    employees: [
      {
        id: '401',
        name: 'Nilufar Azimova',
        position: 'Nail Technician',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    workingHours: {
      monday: { open: '10:00', close: '20:00' },
      tuesday: { open: '10:00', close: '20:00' },
      wednesday: { open: '10:00', close: '20:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '20:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: null, close: null }
    },
    timeSlots: generateTimeSlots(10, 20, 60, ['14:00']),
    latitude: 41.2995,
    longitude: 69.2401,
    services: [
      {
        id: '4001',
        name: 'Classic Manicure',
        nameRu: 'Классический маникюр',
        nameUz: 'Klassik manikür',
        description: 'Basic manicure with polish',
        descriptionRu: 'Базовый маникюр с покрытием',
        descriptionUz: 'Oddiy manikür lak bilan',
        duration: 45,
        price: 80000
      },
      {
        id: '4002',
        name: 'Gel Nails',
        nameRu: 'Гель-лак',
        nameUz: 'Gel tirnoqlar',
        description: 'Long-lasting gel nail application',
        descriptionRu: 'Долговременное гелевое покрытие',
        descriptionUz: 'Uzoq muddatli gel tirnoq qoplama',
        duration: 60,
        price: 120000
      },
      {
        id: '4003',
        name: 'Pedicure',
        nameRu: 'Педикюр',
        nameUz: 'Pedikür',
        description: 'Relaxing pedicure with polish',
        descriptionRu: 'Расслабляющий педикюр с покрытием',
        descriptionUz: 'Dam olish pedikür lak bilan',
        duration: 60,
        price: 100000
      },
      {
        id: '4004',
        name: 'Manicure + Pedicure Combo',
        nameRu: 'Комбо маникюр + педикюр',
        nameUz: 'Manikür + pedikür kombinatsiyasi',
        description: 'Free manicure with pedicure - Special promotion offer',
        descriptionRu: 'Бесплатный маникюр с педикюром - Специальное предложение',
        descriptionUz: 'Pedikür bilan bepul manikür - Maxsus aksiya taklifi',
        duration: 105,
        price: 100000,
        originalPrice: 180000,
        isPromotion: true,
        promotionId: '2'
      }
    ]
  },
  
  // Samarkand businesses
  {
    id: '5',
    name: 'Samarkand Barbers',
    category: 'barber',
    cityId: '2',
    address: '15 Registan Square, Samarkand',
    addressRu: 'Площадь Регистан 15, Самарканд',
    addressUz: 'Registon maydoni 15, Samarqand',
    phone: '+998 90 567 8901',
    email: 'info@samarkandbarbers.uz',
    description: 'Traditional barbershop with modern techniques in the heart of Samarkand.',
    descriptionRu: 'Традиционный барбершоп с современными техниками в сердце Самарканда.',
    descriptionUz: 'Samarqand markazida zamonaviy texnikalar bilan an\'anaviy sartaroshxona.',
    rating: 4.5,
    reviewCount: 98,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    employees: [
      {
        id: '501',
        name: 'Akbar Safarov',
        position: 'Master Barber',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      },
      {
        id: '502',
        name: 'Nodir Khasanov',
        position: 'Barber',
        image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    workingHours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '19:00' },
      saturday: { open: '10:00', close: '17:00' },
      sunday: { open: null, close: null }
    },
    timeSlots: generateTimeSlots(9, 19, 30, ['13:00', '13:30']),
    latitude: 39.6542,
    longitude: 66.9597,
    services: [
      {
        id: '5001',
        name: 'Traditional Haircut',
        nameRu: 'Традиционная стрижка',
        nameUz: 'An\'anaviy soch turmagi',
        description: 'Classic haircut with traditional techniques',
        descriptionRu: 'Классическая стрижка с традиционными техниками',
        descriptionUz: 'An\'anaviy texnikalar bilan klassik soch turmagi',
        duration: 30,
        price: 70000
      },
      {
        id: '5002',
        name: 'Beard Grooming',
        nameRu: 'Уход за бородой',
        nameUz: 'Soqol parvarishi',
        description: 'Complete beard grooming and shaping',
        descriptionRu: 'Полный уход и моделирование бороды',
        descriptionUz: 'To\'liq soqol parvarishi va shakllantirish',
        duration: 25,
        price: 50000
      },
      {
        id: '5003',
        name: 'VIP Package',
        nameRu: 'VIP-пакет',
        nameUz: 'VIP paket',
        description: 'Premium haircut, beard trim, and facial treatment',
        descriptionRu: 'Премиум стрижка, подравнивание бороды и уход за лицом',
        descriptionUz: 'Premium soch turmagi, soqol olish va yuz parvarishi',
        duration: 75,
        price: 150000
      }
    ]
  },
  {
    id: '6',
    name: 'Silk Road Salon',
    category: 'hairSalon',
    cityId: '2',
    address: '42 Tashkent Street, Samarkand',
    addressRu: 'Улица Ташкентская 42, Самарканд',
    addressUz: 'Toshkent ko\'chasi 42, Samarqand',
    phone: '+998 90 678 9012',
    email: 'info@silkroadsalon.uz',
    description: 'Elegant hair salon inspired by the rich history of the Silk Road.',
    descriptionRu: 'Элегантный салон красоты, вдохновленный богатой историей Шелкового пути.',
    descriptionUz: 'Ipak yo\'lining boy tarixidan ilhomlangan nafis soch saloni.',
    rating: 4.7,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1470259078422-826894b933aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    employees: [
      {
        id: '601',
        name: 'Zarina Kamalova',
        position: 'Hair Stylist',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    workingHours: {
      monday: { open: '10:00', close: '20:00' },
      tuesday: { open: '10:00', close: '20:00' },
      wednesday: { open: '10:00', close: '20:00' },
      thursday: { open: '10:00', close: '20:00' },
      friday: { open: '10:00', close: '20:00' },
      saturday: { open: '10:00', close: '18:00' },
      sunday: { open: '11:00', close: '16:00' }
    },
    timeSlots: generateTimeSlots(10, 20, 60, ['14:00']),
    latitude: 39.6270,
    longitude: 66.9750,
    services: [
      {
        id: '6001',
        name: 'Luxury Haircut',
        nameRu: 'Люкс стрижка',
        nameUz: 'Hashamatli soch turmagi',
        description: 'Premium haircut with styling and treatment',
        descriptionRu: 'Премиум стрижка с укладкой и уходом',
        descriptionUz: 'Uslublash va parvarish bilan premium soch turmagi',
        duration: 60,
        price: 180000
      },
      {
        id: '6002',
        name: 'Balayage',
        nameRu: 'Балаяж',
        nameUz: 'Balayaj',
        description: 'Artistic hair coloring technique',
        descriptionRu: 'Художественная техника окрашивания волос',
        descriptionUz: 'Badiiy soch bo\'yash texnikasi',
        duration: 150,
        price: 350000
      },
      {
        id: '6003',
        name: 'Hair Treatment',
        nameRu: 'Уход за волосами',
        nameUz: 'Soch parvarishi',
        description: 'Deep conditioning and repair treatment',
        descriptionRu: 'Глубокое кондиционирование и восстанавливающий уход',
        descriptionUz: 'Chuqur konditsioner va tiklash muolajasi',
        duration: 45,
        price: 120000
      }
    ]
  },
  {
    id: '7',
    name: 'Samarkand Nails',
    category: 'nailSalon',
    cityId: '2',
    address: '8 Amir Timur Street, Samarkand',
    addressRu: 'Улица Амира Тимура 8, Самарканд',
    addressUz: 'Amir Temur ko\'chasi 8, Samarqand',
    phone: '+998 90 789 0123',
    email: 'info@samarkandnails.uz',
    description: 'Specialized nail salon with artistic nail designs and quality products.',
    descriptionRu: 'Специализированный салон ногтей с художественным дизайном и качественными продуктами.',
    descriptionUz: 'Badiiy tirnoq dizayni va sifatli mahsulotlar bilan ixtisoslashgan tirnoq saloni.',
    rating: 4.6,
    reviewCount: 87,
    image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    employees: [
      {
        id: '701',
        name: 'Gulnora Rakhimova',
        position: 'Nail Artist',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    workingHours: {
      monday: { open: '09:00', close: '19:00' },
      tuesday: { open: '09:00', close: '19:00' },
      wednesday: { open: '09:00', close: '19:00' },
      thursday: { open: '09:00', close: '19:00' },
      friday: { open: '09:00', close: '19:00' },
      saturday: { open: '10:00', close: '17:00' },
      sunday: { open: null, close: null }
    },
    timeSlots: generateTimeSlots(9, 19, 60, ['13:00']),
    latitude: 39.6542,
    longitude: 66.9597,
    services: [
      {
        id: '7001',
        name: 'Silk Road Manicure',
        nameRu: 'Маникюр "Шелковый путь"',
        nameUz: 'Ipak yo\'li manikuri',
        description: 'Signature manicure with unique designs',
        descriptionRu: 'Фирменный маникюр с уникальным дизайном',
        descriptionUz: 'Noyob dizayn bilan maxsus manikür',
        duration: 60,
        price: 90000
      },
      {
        id: '7002',
        name: 'Luxury Pedicure',
        nameRu: 'Люкс педикюр',
        nameUz: 'Hashamatli pedikür',
        description: 'Premium pedicure with foot massage',
        descriptionRu: 'Премиум педикюр с массажем стоп',
        descriptionUz: 'Oyoq massaji bilan premium pedikür',
        duration: 75,
        price: 120000
      },
      {
        id: '7003',
        name: 'Nail Art',
        nameRu: 'Нейл-арт',
        nameUz: 'Tirnoq san\'ati',
        description: 'Creative nail art and designs',
        descriptionRu: 'Креативный нейл-арт и дизайн',
        descriptionUz: 'Ijodiy tirnoq san\'ati va dizaynlari',
        duration: 45,
        price: 70000
      }
    ]
  },
  {
    id: '8',
    name: 'Samarkand Football Arena',
    category: 'football',
    cityId: '2',
    address: '120 Gagarin Avenue, Samarkand',
    addressRu: 'Проспект Гагарина 120, Самарканд',
    addressUz: 'Gagarin shoh ko\'chasi 120, Samarqand',
    phone: '+998 90 890 1234',
    email: 'info@samarkandfootball.uz',
    description: 'Modern football pitch with excellent facilities for teams and individuals.',
    descriptionRu: 'Современное футбольное поле с отличными условиями для команд и отдельных лиц.',
    descriptionUz: 'Jamoalar va shaxslar uchun ajoyib imkoniyatlarga ega zamonaviy futbol maydoni.',
    rating: 4.8,
    reviewCount: 65,
    image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    employees: [
      {
        id: '801',
        name: 'Sardor Nazarov',
        position: 'Facility Manager',
        image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    workingHours: {
      monday: { open: '08:00', close: '22:00' },
      tuesday: { open: '08:00', close: '22:00' },
      wednesday: { open: '08:00', close: '22:00' },
      thursday: { open: '08:00', close: '22:00' },
      friday: { open: '08:00', close: '22:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '08:00', close: '22:00' }
    },
    timeSlots: generateTimeSlots(8, 22, 60, []),
    latitude: 39.6270,
    longitude: 66.9750,
    services: [
      {
        id: '8001',
        name: 'Full Field Rental',
        nameRu: 'Аренда всего поля',
        nameUz: 'To\'liq maydon ijarasi',
        description: 'Rent the entire football field for your team',
        descriptionRu: 'Аренда всего футбольного поля для вашей команды',
        descriptionUz: 'Jamoangiz uchun butun futbol maydonini ijaraga olish',
        duration: 60,
        price: 300000
      },
      {
        id: '8002',
        name: 'Half Field Rental',
        nameRu: 'Аренда половины поля',
        nameUz: 'Yarim maydon ijarasi',
        description: 'Rent half of the field for smaller groups',
        descriptionRu: 'Аренда половины поля для небольших групп',
        descriptionUz: 'Kichik guruhlar uchun maydonning yarmini ijaraga olish',
        duration: 60,
        price: 180000
      },
      {
        id: '8003',
        name: 'Training Session',
        nameRu: 'Тренировочная сессия',
        nameUz: 'Mashg\'ulot sessiyasi',
        description: 'Guided training session with a coach',
        descriptionRu: 'Тренировочная сессия с тренером',
        descriptionUz: 'Murabbiy bilan mashg\'ulot sessiyasi',
        duration: 90,
        price: 400000
      }
    ]
  },
  
  // Nurobod businesses
  {
    id: '9',
    name: 'Nurobod Barber',
    category: 'barber',
    cityId: '3',
    address: '5 Central Street, Nurobod',
    addressRu: 'Центральная улица 5, Нурабад',
    addressUz: 'Markaziy ko\'cha 5, Nurobod',
    phone: '+998 90 901 2345',
    email: 'info@nurobodbarber.uz',
    description: 'Local barbershop serving the Nurobod community with quality haircuts.',
    descriptionRu: 'Местный барбершоп, обслуживающий сообщество Нурабада качественными стрижками.',
    descriptionUz: 'Nurobod jamoasiga sifatli soch turmagi xizmatini ko\'rsatuvchi mahalliy sartaroshxona.',
    rating: 4.4,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    employees: [
      {
        id: '901',
        name: 'Jamshid Yusupov',
        position: 'Barber',
        image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    workingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '16:00' },
      sunday: { open: null, close: null }
    },
    timeSlots: generateTimeSlots(9, 18, 30, ['13:00', '13:30']),
    latitude: 40.1031,
    longitude: 67.8417,
    services: [
      {
        id: '9001',
        name: 'Standard Haircut',
        nameRu: 'Стандартная стрижка',
        nameUz: 'Standart soch turmagi',
        description: 'Basic men\'s haircut',
        descriptionRu: 'Базовая мужская стрижка',
        descriptionUz: 'Oddiy erkaklar soch turmagi',
        duration: 30,
        price: 50000
      },
      {
        id: '9002',
        name: 'Beard Trim',
        nameRu: 'Подравнивание бороды',
        nameUz: 'Soqol tekislash',
        description: 'Simple beard trimming service',
        descriptionRu: 'Простая услуга по подравниванию бороды',
        descriptionUz: 'Oddiy soqol tekislash xizmati',
        duration: 15,
        price: 30000
      },
      {
        id: '9003',
        name: 'Kids Haircut',
        nameRu: 'Детская стрижка',
        nameUz: 'Bolalar soch turmagi',
        description: 'Haircut for children under 12',
        descriptionRu: 'Стрижка для детей до 12 лет',
        descriptionUz: '12 yoshgacha bo\'lgan bolalar uchun soch turmagi',
        duration: 20,
        price: 40000
      }
    ]
  },
  {
    id: '10',
    name: 'Nurobod Beauty',
    category: 'hairSalon',
    cityId: '3',
    address: '12 School Street, Nurobod',
    addressRu: 'Школьная улица 12, Нурабад',
    addressUz: 'Maktab ko\'chasi 12, Nurobod',
    phone: '+998 90 012 3456',
    email: 'info@nurobodbeauty.uz',
    description: 'Family-friendly beauty salon offering hair services for women, men, and children.',
    descriptionRu: 'Семейный салон красоты, предлагающий услуги по уходу за волосами для женщин, мужчин и детей.',
    descriptionUz: 'Ayollar, erkaklar va bolalar uchun soch xizmatlarini taklif etuvchi oilaviy go\'zallik saloni.',
    rating: 4.5,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    employees: [
      {
        id: '1001',
        name: 'Dilnoza Saidova',
        position: 'Hair Stylist',
        image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    ],
    workingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '09:00', close: '16:00' },
      sunday: { open: null, close: null }
    },
    timeSlots: generateTimeSlots(9, 18, 60, ['13:00']),
    latitude: 40.1031,
    longitude: 67.8417,
    services: [
      {
        id: '10001',
        name: 'Women\'s Haircut',
        nameRu: 'Женская стрижка',
        nameUz: 'Ayollar soch turmagi',
        description: 'Basic women\'s haircut and styling',
        descriptionRu: 'Базовая женская стрижка и укладка',
        descriptionUz: 'Oddiy ayollar soch turmagi va uslublash',
        duration: 45,
        price: 80000
      },
      {
        id: '10002',
        name: 'Men\'s Haircut',
        nameRu: 'Мужская стрижка',
        nameUz: 'Erkaklar soch turmagi',
        description: 'Basic men\'s haircut',
        descriptionRu: 'Базовая мужская стрижка',
        descriptionUz: 'Oddiy erkaklar soch turmagi',
        duration: 30,
        price: 60000
      },
      {
        id: '10003',
        name: 'Hair Coloring',
        nameRu: 'Окрашивание волос',
        nameUz: 'Soch bo\'yash',
        description: 'Basic hair coloring service',
        descriptionRu: 'Базовая услуга окрашивания волос',
        descriptionUz: 'Oddiy soch bo\'yash xizmati',
        duration: 90,
        price: 200000
      }
    ]
  }
];

export const getBusinessesByCity = (cityId: string) => {
  return businesses.filter(business => business.cityId === cityId);
};

export const getBusinessesByCategory = (category: string) => {
  return businesses.filter(business => business.category === category);
};

export const getBusinessById = (id: string) => {
  return businesses.find(business => business.id === id);
};

export const getRecentlyVisitedBusinesses = () => {
  // In a real app, this would be fetched from user data
  // For now, return a few random businesses
  return [businesses[0], businesses[3], businesses[7]];
};

export const getRecommendedBusinesses = () => {
  // In a real app, this would be based on user preferences
  // For now, return businesses with highest ratings
  return businesses
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
};