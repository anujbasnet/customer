import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { businesses } from "../../../../../mocks/businesses";

export const listBusinessesProcedure = publicProcedure
  .input(z.object({ 
    cityId: z.string().optional(),
    category: z.string().optional(),
    limit: z.number().optional().default(10),
    offset: z.number().optional().default(0)
  }))
  .query(({ input }) => {
    let filteredBusinesses = businesses;
    
    if (input.cityId) {
      filteredBusinesses = filteredBusinesses.filter(b => b.cityId === input.cityId);
    }
    
    if (input.category) {
      filteredBusinesses = filteredBusinesses.filter(b => b.category === input.category);
    }
    
    const total = filteredBusinesses.length;
    const paginatedBusinesses = filteredBusinesses.slice(input.offset, input.offset + input.limit);
    
    return {
      businesses: paginatedBusinesses,
      total,
      hasMore: input.offset + input.limit < total
    };
  });