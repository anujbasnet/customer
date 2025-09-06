import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

const logoutSchema = z.object({
  accessToken: z.string(),
});

export const logoutProcedure = publicProcedure
  .input(logoutSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { error } = await ctx.supabase.auth.signOut();

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('Logout error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Logout failed',
      });
    }
  });