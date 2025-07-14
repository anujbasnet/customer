import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { businesses } from "../../../../../mocks/businesses";

export const getBusinessProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ input }) => {
    const business = businesses.find(b => b.id === input.id);
    
    if (!business) {
      throw new Error('Business not found');
    }
    
    return business;
  });