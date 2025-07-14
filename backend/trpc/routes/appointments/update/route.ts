import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { appointments } from "../../../../../mocks/appointments";

export const updateAppointmentProcedure = publicProcedure
  .input(z.object({ 
    id: z.string(),
    status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']).optional(),
    date: z.string().optional(),
    time: z.string().optional()
  }))
  .mutation(({ input }) => {
    const appointmentIndex = appointments.findIndex(a => a.id === input.id);
    
    if (appointmentIndex === -1) {
      throw new Error('Appointment not found');
    }
    
    // Update the appointment
    const updatedAppointment = {
      ...appointments[appointmentIndex],
      ...(input.status && { status: input.status }),
      ...(input.date && { date: input.date }),
      ...(input.time && { time: input.time })
    };
    
    appointments[appointmentIndex] = updatedAppointment;
    
    return updatedAppointment;
  });