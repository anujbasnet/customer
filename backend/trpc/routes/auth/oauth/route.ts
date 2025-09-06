import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

const oauthSchema = z.object({
  provider: z.enum(['google', 'facebook', 'apple']),
  redirectTo: z.string().optional(),
});

export const oauthProcedure = publicProcedure
  .input(oauthSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      const { data, error } = await ctx.supabase.auth.signInWithOAuth({
        provider: input.provider,
        options: {
          redirectTo: input.redirectTo || `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/callback`,
        },
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return {
        url: data.url,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('OAuth error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'OAuth authentication failed',
      });
    }
  });