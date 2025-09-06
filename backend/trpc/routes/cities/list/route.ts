import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

export const listCitiesProcedure = publicProcedure
  .query(async ({ ctx }) => {
    try {
      const { data: cities, error } = await ctx.supabase
        .from('cities')
        .select('*')
        .order('name');

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch cities',
        });
      }

      return cities.map(city => ({
        id: city.id,
        name: city.name,
        nameRu: city.name_ru,
        nameUz: city.name_uz,
      }));
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('Cities fetch error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch cities',
      });
    }
  });