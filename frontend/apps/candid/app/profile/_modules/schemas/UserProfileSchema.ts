import { optional, z } from 'zod';

export const userProfileSchema = z.object({
  email: z.string().optional(),
  last_name: z.string().optional(),
  first_name: z.string().optional(),
  current_job_title: z.string().optional(),
});

export type UserProfileSchema = z.infer<typeof userProfileSchema>;
