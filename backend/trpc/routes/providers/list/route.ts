import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { providers } from "../../../../../mocks/providers";

export const listProvidersProcedure = publicProcedure
  .input(z.object({ 
    category: z.string().optional(),
    limit: z.number().optional().default(10),
    offset: z.number().optional().default(0)
  }))
  .query(({ input }) => {
    let filteredProviders = providers;
    
    if (input.category) {
      filteredProviders = filteredProviders.filter(p => p.category === input.category);
    }
    
    const total = filteredProviders.length;
    const paginatedProviders = filteredProviders.slice(input.offset, input.offset + input.limit);
    
    return {
      providers: paginatedProviders,
      total,
      hasMore: input.offset + input.limit < total
    };
  });