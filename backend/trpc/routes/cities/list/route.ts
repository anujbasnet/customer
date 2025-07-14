import { publicProcedure } from "../../../create-context";
import { cities } from "../../../../../mocks/cities";

export const listCitiesProcedure = publicProcedure
  .query(() => {
    return cities;
  });