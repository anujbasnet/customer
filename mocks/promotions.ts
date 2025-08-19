export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: string;
  businessId: string;
  businessName: string;
  image: string;
  validUntil: string;
  category: string;
}

export const promotions: Promotion[] = [
  {
    id: '1',
    title: '30% Off First Visit',
    description: 'Get 30% discount on your first haircut at Elite Barbers',
    discount: '30%',
    businessId: '1',
    businessName: 'Elite Barbers',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    validUntil: '2024-12-31',
    category: 'barber'
  },
  {
    id: '2',
    title: 'Free Manicure with Pedicure',
    description: 'Book a pedicure and get a basic manicure absolutely free',
    discount: 'Free Service',
    businessId: '4',
    businessName: 'Polished Nails',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    validUntil: '2024-11-30',
    category: 'nailSalon'
  },
  {
    id: '3',
    title: 'Spa Day Package',
    description: 'Complete spa experience with massage, facial and relaxation',
    discount: '25%',
    businessId: '5',
    businessName: 'Zen Spa',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    validUntil: '2024-12-15',
    category: 'spa'
  },
  {
    id: '4',
    title: 'Student Discount',
    description: '20% off all services for students with valid ID',
    discount: '20%',
    businessId: '6',
    businessName: 'Silk Road Salon',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    validUntil: '2024-12-31',
    category: 'hairSalon'
  }
];

export const getPromotions = () => {
  return promotions;
};