import { publicProcedure } from "../../../create-context";
import { categories } from "../../../../../mocks/categories";

export const listCategoriesProcedure = publicProcedure
  .query(() => {
    return categories;
  });