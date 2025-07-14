import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { appointments } from "../../../../../mocks/appointments";

const createAppointmentSchema = z.object({
  businessId: z.string(),
  businessName: z.string(),
  serviceId: z.string(),
  serviceName: z.string(),
  employeeId: z.string(),
  employeeName: z.string(),
  date: z.string(),
  time: z.string(),
  duration: z.number(),
  price: z.number()
});

export const createAppointmentProcedure = publicProcedure
  .input(createAppointmentSchema)
  .mutation(({ input }) => {
    const newAppointment = {
      id: (appointments.length + 1).toString(),
      ...input,
      status: 'pending' as const
    };
    
    // In a real app, you'd save this to a database
    appointments.push(newAppointment);
    
    return newAppointment;
  });