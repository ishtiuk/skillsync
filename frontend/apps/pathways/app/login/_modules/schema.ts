import { z } from 'zod';

export const registerUserSchema = z
  .object({
    first_name: z.string().min(1, 'First name is required.'),

    last_name: z.string().min(1, 'Last name is required.'),

    email: z.string().email('Please provide a valid email address.'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .max(32, 'Password must be at most 32 characters long.'),

    passwordReentered: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .max(32, 'Password must be at most 32 characters long.')
  })
  .refine(data => data.password === data.passwordReentered, {
    message: 'Passwords do not match',
    path: ['passwordReentered']
  });

export const loginUserSchema = z.object({
  email: z.string().email('Please provide a valid email address.'),

  password: z.string().min(8, 'Password must be at least 8 characters long.')
});

export type LoginUserSchema = z.infer<typeof loginUserSchema>;

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;
