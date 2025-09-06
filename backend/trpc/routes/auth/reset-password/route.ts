import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

const resetPasswordSchema = z.object({
  password: z.string().min(6),
  accessToken: z.string(),
});

export const resetPasswordProcedure = publicProcedure
  .input(resetPasswordSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { error } = await ctx.supabase.auth.updateUser({
        password: input.password,
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('Reset password error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to reset password',
      });
    }
  });