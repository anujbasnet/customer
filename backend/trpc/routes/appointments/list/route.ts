import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { appointments } from "../../../../../mocks/appointments";

export const listAppointmentsProcedure = publicProcedure
  .input(z.object({ 
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
    userId: z.string().optional()
  }))
  .query(({ input }) => {
    let filteredAppointments = appointments;
    
    if (input.status) {
      filteredAppointments = filteredAppointments.filter(a => a.status === input.status);
    }
    
    // In a real app, you'd filter by userId from the authenticated user
    // For now, we'll return all appointments
    
    return filteredAppointments;
  });