import { publicProcedure } from "../../../create-context";
import { businesses } from "../../../../../mocks/businesses";
import { appointments } from "../../../../../mocks/appointments";
import { categories } from "../../../../../mocks/categories";

export const getStatsOverviewProcedure = publicProcedure
  .query(() => {
    const totalBusinesses = businesses.length;
    const totalAppointments = appointments.length;
    const totalCategories = categories.length;
    
    const completedAppointments = appointments.filter(a => a.status === 'completed').length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
    const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
    
    const averageRating = businesses.reduce((sum, b) => sum + b.rating, 0) / businesses.length;
    
    const businessesByCategory = categories.map(category => ({
      category: category.name,
      count: businesses.filter(b => b.category === category.name).length
    }));
    
    return {
      totalBusinesses,
      totalAppointments,
      totalCategories,
      completedAppointments,
      pendingAppointments,
      confirmedAppointments,
      averageRating: Math.round(averageRating * 10) / 10,
      businessesByCategory
    };
  });