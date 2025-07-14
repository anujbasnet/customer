import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";

// Business routes
import { listBusinessesProcedure } from "./routes/businesses/list/route";
import { getBusinessProcedure } from "./routes/businesses/get/route";
import { searchBusinessesProcedure } from "./routes/businesses/search/route";
import { getRecommendedBusinessesProcedure } from "./routes/businesses/recommended/route";
import { getRecentBusinessesProcedure } from "./routes/businesses/recent/route";

// Category routes
import { listCategoriesProcedure } from "./routes/categories/list/route";

// Appointment routes
import { listAppointmentsProcedure } from "./routes/appointments/list/route";
import { createAppointmentProcedure } from "./routes/appointments/create/route";
import { updateAppointmentProcedure } from "./routes/appointments/update/route";

// City routes
import { listCitiesProcedure } from "./routes/cities/list/route";

// Provider routes
import { listProvidersProcedure } from "./routes/providers/list/route";
import { getProviderProcedure } from "./routes/providers/get/route";

// Auth routes
import { loginProcedure } from "./routes/auth/login/route";
import { registerProcedure } from "./routes/auth/register/route";

// Stats routes
import { getStatsOverviewProcedure } from "./routes/stats/overview/route";

// Test routes
import { getTestDataProcedure } from "./routes/test/data/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  businesses: createTRPCRouter({
    list: listBusinessesProcedure,
    get: getBusinessProcedure,
    search: searchBusinessesProcedure,
    recommended: getRecommendedBusinessesProcedure,
    recent: getRecentBusinessesProcedure,
  }),
  categories: createTRPCRouter({
    list: listCategoriesProcedure,
  }),
  appointments: createTRPCRouter({
    list: listAppointmentsProcedure,
    create: createAppointmentProcedure,
    update: updateAppointmentProcedure,
  }),
  cities: createTRPCRouter({
    list: listCitiesProcedure,
  }),
  providers: createTRPCRouter({
    list: listProvidersProcedure,
    get: getProviderProcedure,
  }),
  auth: createTRPCRouter({
    login: loginProcedure,
    register: registerProcedure,
  }),
  stats: createTRPCRouter({
    overview: getStatsOverviewProcedure,
  }),
  test: createTRPCRouter({
    data: getTestDataProcedure,
  }),
});

export type AppRouter = typeof appRouter;