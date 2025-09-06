import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { supabaseAdmin } from "../../../../../lib/supabase";

export const listBusinessesProcedure = publicProcedure
  .input(z.object({ 
    cityId: z.string().optional(),
    category: z.string().optional(),
    limit: z.number().optional().default(10),
    offset: z.number().optional().default(0)
  }))
  .query(async ({ input }) => {
    let query = supabaseAdmin
      .from('businesses')
      .select(`
        *,
        categories(name, icon),
        cities(name, name_ru, name_uz),
        employees(*),
        services(*),
        portfolio_items(*)
      `);
    
    if (input.cityId) {
      query = query.eq('city_id', input.cityId);
    }
    
    if (input.category) {
      query = query.eq('category_id', input.category);
    }
    
    const { data: businesses, error, count } = await query
      .range(input.offset, input.offset + input.limit - 1)
      .order('rating', { ascending: false });
    
    if (error) {
      throw new Error(`Failed to fetch businesses: ${error.message}`);
    }
    
    const total = count || 0;
    
    return {
      businesses: businesses || [],
      total,
      hasMore: input.offset + input.limit < total
    };
  });