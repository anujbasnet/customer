import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseAdmin } from "../../../../../lib/supabase";

const createAppointmentSchema = z.object({
  businessId: z.string(),
  serviceId: z.string(),
  employeeId: z.string(),
  date: z.string(),
  time: z.string(),
  duration: z.number(),
  price: z.number(),
  discountAmount: z.number().optional().default(0)
});

export const createAppointmentProcedure = protectedProcedure
  .input(createAppointmentSchema)
  .mutation(async ({ input, ctx }) => {
    const { data: appointment, error } = await supabaseAdmin
      .from('appointments')
      .insert({
        user_id: ctx.user.id,
        business_id: input.businessId,
        service_id: input.serviceId,
        employee_id: input.employeeId,
        date: input.date,
        time: input.time,
        duration: input.duration,
        price: input.price,
        discount_amount: input.discountAmount,
        status: 'pending'
      })
      .select(`
        *,
        businesses(name, image),
        services(name, name_ru, name_uz),
        employees(name, position)
      `)
      .single();
    
    if (error) {
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
    
    return appointment;
  });