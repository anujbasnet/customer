import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { providers } from "../../../../../mocks/providers";

export const getProviderProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ input }) => {
    const provider = providers.find(p => p.id === input.id);
    
    if (!provider) {
      throw new Error('Provider not found');
    }
    
    return provider;
  });