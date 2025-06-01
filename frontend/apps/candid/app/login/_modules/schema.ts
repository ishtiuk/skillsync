import { z } from 'zod';

export const loginUserSchema = z.object({
  email: z.string().email('Please provide a valid email address.'),

  password: z.string().min(8, 'Password must be at least 8 characters long.')
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>;
