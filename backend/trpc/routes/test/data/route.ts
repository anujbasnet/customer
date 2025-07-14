import { publicProcedure } from "../../../create-context";
import { businesses } from "../../../../../mocks/businesses";
import { categories } from "../../../../../mocks/categories";
import { appointments } from "../../../../../mocks/appointments";

export const getTestDataProcedure = publicProcedure
  .query(() => {
    return {
      message: "Backend is working! Here's a sample of your data:",
      sampleBusiness: businesses[0],
      sampleCategory: categories[0],
      sampleAppointment: appointments[0],
      totalBusinesses: businesses.length,
      totalCategories: categories.length,
      totalAppointments: appointments.length
    };
  });