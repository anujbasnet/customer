import { Appointment } from '@/types';

export const appointments: Appointment[] = [
  {
    id: '1',
    businessId: '1',
    businessName: 'Elite Barbers',
    serviceId: '1001',
    serviceName: 'Haircut',
    employeeId: '101',
    employeeName: 'Rustam Karimov',
    date: '2023-11-15',
    time: '10:00',
    duration: 30,
    price: 80000,
    status: 'confirmed'
  },
  {
    id: '2',
    businessId: '2',
    businessName: 'Modern Cuts',
    serviceId: '2001',
    serviceName: 'Trendy Haircut',
    employeeId: '201',
    employeeName: 'Bobur Alimov',
    date: '2023-11-20',
    time: '14:30',
    duration: 45,
    price: 100000,
    status: 'pending'
  },
  {
    id: '3',
    businessId: '6',
    businessName: 'Silk Road Salon',
    serviceId: '6001',
    serviceName: 'Luxury Haircut',
    employeeId: '601',
    employeeName: 'Zarina Kamalova',
    date: '2023-10-05',
    time: '11:00',
    duration: 60,
    price: 180000,
    status: 'completed'
  },
  {
    id: '4',
    businessId: '4',
    businessName: 'Polished Nails',
    serviceId: '4001',
    serviceName: 'Classic Manicure',
    employeeId: '401',
    employeeName: 'Nilufar Azimova',
    date: '2023-10-10',
    time: '16:00',
    duration: 45,
    price: 80000,
    status: 'cancelled'
  }
];

export const getUserAppointments = () => {
  return appointments;
};

export const getUpcomingAppointments = () => {
  return appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
};

export const getPastAppointments = () => {
  return appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');
};