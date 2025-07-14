import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { businesses } from "../../../../../mocks/businesses";

export const getRecommendedBusinessesProcedure = publicProcedure
  .input(z.object({ 
    cityId: z.string().optional(),
    limit: z.number().optional().default(4)
  }))
  .query(({ input }) => {
    let filteredBusinesses = businesses;
    
    if (input.cityId) {
      filteredBusinesses = filteredBusinesses.filter(b => b.cityId === input.cityId);
    }
    
    // Sort by rating and review count to get recommended businesses
    const recommendedBusinesses = filteredBusinesses
      .sort((a, b) => {
        // Primary sort by rating
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }
        // Secondary sort by review count
        return b.reviewCount - a.reviewCount;
      })
      .slice(0, input.limit);
    
    return recommendedBusinesses;
  });