import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { supabaseAdmin } from "@/lib/supabase";

// Context creation function
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  // Extract authorization header
  const authorization = opts.req.headers.get('authorization');
  let user = null;
  
  if (authorization) {
    try {
      // Verify the JWT token
      const token = authorization.replace('Bearer ', '');
      const { data: { user: authUser }, error } = await supabaseAdmin.auth.getUser(token);
      
      if (!error && authUser) {
        // Get user profile from our users table
        const { data: userProfile } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        user = userProfile;
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  }
  
  return {
    req: opts.req,
    user,
    supabase: supabaseAdmin,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected procedure that requires authentication
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});