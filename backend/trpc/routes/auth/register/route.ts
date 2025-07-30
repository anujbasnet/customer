import { z } from "zod";
import { publicProcedure } from "../../../create-context";

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
  .mutation(({ input }) => {
    // In a real app, you'd save the user to a database
    // For now, we'll simulate a successful registration
    
    const newUser = {
      id: Date.now().toString(),
      name: input.name,
      email: input.email,
      phone: input.phone,
      gender: input.gender,
      birthday: input.birthday,
      address: input.address,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      cityId: "1"
    };
    
    return {
      user: newUser,
      token: "mock-jwt-token"
    };
  });