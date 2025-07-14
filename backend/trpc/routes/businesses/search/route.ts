import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { businesses } from "../../../../../mocks/businesses";

export const searchBusinessesProcedure = publicProcedure
  .input(z.object({ 
    query: z.string(),
    cityId: z.string().optional(),
    category: z.string().optional(),
    limit: z.number().optional().default(10)
  }))
  .query(({ input }) => {
    let filteredBusinesses = businesses;
    
    // Filter by city if provided
    if (input.cityId) {
      filteredBusinesses = filteredBusinesses.filter(b => b.cityId === input.cityId);
    }
    
    // Filter by category if provided
    if (input.category) {
      filteredBusinesses = filteredBusinesses.filter(b => b.category === input.category);
    }
    
    // Search by name, description, or services
    const searchQuery = input.query.toLowerCase();
    filteredBusinesses = filteredBusinesses.filter(business => 
      business.name.toLowerCase().includes(searchQuery) ||
      business.description.toLowerCase().includes(searchQuery) ||
      business.descriptionRu.toLowerCase().includes(searchQuery) ||
      business.descriptionUz.toLowerCase().includes(searchQuery) ||
      business.services.some(service => 
        service.name.toLowerCase().includes(searchQuery) ||
        service.description.toLowerCase().includes(searchQuery) ||
        (service.nameRu && service.nameRu.toLowerCase().includes(searchQuery)) ||
        (service.nameUz && service.nameUz.toLowerCase().includes(searchQuery))
      )
    );
    
    return filteredBusinesses.slice(0, input.limit);
  });