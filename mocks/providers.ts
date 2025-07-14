import { Provider } from '@/types';

export const providers: Provider[] = [
  {
    id: '1',
    name: 'Modern Cuts',
    category: 'hairSalon',
    description: "Modern Cuts is a premium hair salon offering the latest styles and techniques. Our experienced stylists are dedicated to helping you look and feel your best.",
    address: '123 Main St, New York, NY',
    rating: 4.8,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    services: [
      {
        id: '101',
        name: 'Haircut',
        description: 'Professional haircut with consultation',
        duration: 45,
        price: 35
      },
      {
        id: '102',
        name: 'Hair Coloring',
        description: 'Full hair coloring service',
        duration: 120,
        price: 85
      },
      {
        id: '103',
        name: 'Blowout',
        description: 'Professional blow dry and styling',
        duration: 30,
        price: 25
      }
    ]
  },
  {
    id: '2',
    name: 'Classic Barber',
    category: 'barber',
    description: "Classic Barber offers traditional barbering services with a modern twist. Our skilled barbers provide precision cuts and grooming in a relaxed atmosphere.",
    address: '456 Oak St, Brooklyn, NY',
    rating: 4.9,
    reviewCount: 203,
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    services: [
      {
        id: '201',
        name: 'Haircut',
        description: 'Classic men\'s haircut',
        duration: 30,
        price: 25
      },
      {
        id: '202',
        name: 'Beard Trim',
        description: 'Professional beard trimming and shaping',
        duration: 20,
        price: 15
      },
      {
        id: '203',
        name: 'Hot Towel Shave',
        description: 'Traditional hot towel straight razor shave',
        duration: 45,
        price: 35
      }
    ]
  },
  {
    id: '3',
    name: 'Polished Nails',
    category: 'nailSalon',
    description: "Polished Nails provides top-quality nail care in a clean, relaxing environment. Our technicians are skilled in the latest trends and techniques.",
    address: '789 Elm St, Manhattan, NY',
    rating: 4.7,
    reviewCount: 178,
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    services: [
      {
        id: '301',
        name: 'Manicure',
        description: 'Basic manicure with polish',
        duration: 30,
        price: 20
      },
      {
        id: '302',
        name: 'Pedicure',
        description: 'Relaxing pedicure with polish',
        duration: 45,
        price: 35
      },
      {
        id: '303',
        name: 'Gel Nails',
        description: 'Long-lasting gel nail application',
        duration: 60,
        price: 45
      }
    ]
  },
  {
    id: '4',
    name: 'Tranquil Spa',
    category: 'spa',
    description: "Tranquil Spa offers a peaceful retreat from the busy world. Our range of treatments are designed to relax, rejuvenate, and restore balance.",
    address: '101 Pine St, Queens, NY',
    rating: 4.9,
    reviewCount: 245,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    services: [
      {
        id: '401',
        name: 'Swedish Massage',
        description: 'Relaxing full-body massage',
        duration: 60,
        price: 80
      },
      {
        id: '402',
        name: 'Facial',
        description: 'Rejuvenating facial treatment',
        duration: 45,
        price: 65
      },
      {
        id: '403',
        name: 'Body Scrub',
        description: 'Exfoliating body treatment',
        duration: 45,
        price: 70
      }
    ]
  },
  {
    id: '5',
    name: 'Healing Hands Massage',
    category: 'massage',
    description: "Healing Hands offers therapeutic massage services to reduce stress, relieve pain, and promote overall wellness. Our licensed therapists customize each session to your needs.",
    address: '222 Cedar St, Bronx, NY',
    rating: 4.8,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    services: [
      {
        id: '501',
        name: 'Deep Tissue Massage',
        description: 'Focused massage for chronic tension',
        duration: 60,
        price: 90
      },
      {
        id: '502',
        name: 'Hot Stone Massage',
        description: 'Relaxing massage with heated stones',
        duration: 75,
        price: 110
      },
      {
        id: '503',
        name: 'Sports Massage',
        description: 'Targeted massage for athletes',
        duration: 60,
        price: 95
      }
    ]
  },
  {
    id: '6',
    name: 'Bright Smile Dental',
    category: 'dental',
    description: "Bright Smile Dental provides comprehensive dental care in a comfortable environment. Our team is committed to maintaining your oral health with the latest techniques.",
    address: '333 Maple St, Staten Island, NY',
    rating: 4.7,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    services: [
      {
        id: '601',
        name: 'Dental Cleaning',
        description: 'Professional teeth cleaning',
        duration: 45,
        price: 100
      },
      {
        id: '602',
        name: 'Teeth Whitening',
        description: 'Professional whitening treatment',
        duration: 60,
        price: 200
      },
      {
        id: '603',
        name: 'Dental Exam',
        description: 'Comprehensive dental examination',
        duration: 30,
        price: 75
      }
    ]
  }
];

export const getProvidersByCategory = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId);
  if (!category) return [];
  
  return providers.filter(p => p.category === category.name);
};

export const getProviderById = (id: string) => {
  return providers.find(p => p.id === id);
};