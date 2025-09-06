import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { TRPCError } from "@trpc/server";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  birthday: z.string().optional(),
  address: z.string().optional()
});

export const registerProcedure = publicProcedure
  .input(registerSchema)
  .mutation(async ({ input, ctx }) => {
    try {
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await ctx.supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (authError) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: authError.message,
        });
      }

      if (!authData.user) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'User creation failed',
        });
      }

      // Create user profile in our users table
      const { data: userProfile, error: profileError } = await ctx.supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: input.email,
          name: input.name,
          phone: input.phone || null,
          gender: input.gender || null,
          birthday: input.birthday || null,
          address: input.address || null,
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          city_id: "1", // Default to Tashkent
        })
        .select()
        .single();

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user profile',
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
      
      console.error('Registration error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Registration failed',
      });
    }
  });