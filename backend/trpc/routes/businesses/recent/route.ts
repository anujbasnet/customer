import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { businesses } from "../../../../../mocks/businesses";

export const getRecentBusinessesProcedure = publicProcedure
  .input(z.object({ 
    userId: z.string().optional(),
    limit: z.number().optional().default(3)
  }))
  .query(({ input }) => {
    // In a real app, you'd fetch user's recently visited businesses from database
    // For now, return some sample businesses
    const recentBusinessIds = ['1', '3', '7']; // Mock recent business IDs
    
    const recentBusinesses = businesses
      .filter(b => recentBusinessIds.includes(b.id))
      .slice(0, input.limit);
    
    return recentBusinesses;
  });