import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginProcedure = publicProcedure
  .input(loginSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await ctx.supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (authError) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      if (!authData.user || !authData.session) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Authentication failed',
        });
      }

      // Get user profile from our users table
      const { data: userProfile, error: profileError } = await ctx.supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !userProfile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User profile not found',
        });
      }

      return {
        user: {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          avatar: userProfile.avatar,
          cityId: userProfile.city_id,
          gender: userProfile.gender,
          birthday: userProfile.birthday,
          address: userProfile.address,
        },
        session: authData.session,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      console.error('Login error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Login failed',
      });
    }
  });