import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const forgotPasswordProcedure = publicProcedure
  .input(forgotPasswordSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { error } = await ctx.supabase.auth.resetPasswordForEmail(input.email, {
        redirectTo: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/reset-password`,
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('Forgot password error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to send password reset email',
      });
    }
  });