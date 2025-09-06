import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { supabaseAdmin } from "../../../../../lib/supabase";

export const getBusinessProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const { data: business, error } = await supabaseAdmin
      .from('businesses')
      .select(`
        *,
        categories(name, icon),
        cities(name, name_ru, name_uz),
        employees(*),
        services(*),
        portfolio_items(*)
      `)
      .eq('id', input.id)
      .single();
    
    if (error || !business) {
      throw new Error('Business not found');
    }
    
    return business;
  });