import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginProcedure = publicProcedure
  .input(loginSchema)
  .mutation(({ input }) => {
    // In a real app, you'd validate credentials against a database
    // For now, we'll simulate a successful login
    
    if (input.email === "demo@example.com" && input.password === "password") {
      return {
        user: {
          id: "1",
          name: "Demo User",
          email: input.email,
          phone: "+998 90 123 4567",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          cityId: "1"
        },
        token: "mock-jwt-token"
      };
    }
    
    throw new Error("Invalid credentials");
  });