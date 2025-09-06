import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

export const listCategoriesProcedure = publicProcedure
  .query(async ({ ctx }) => {
    try {
      const { data: categories, error } = await ctx.supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch categories',
        });
      }

      return categories;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('Categories fetch error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch categories',
      });
    }
  });