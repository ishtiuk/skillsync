import { z } from 'zod';

export const socialSchema = z.object({
  instagram_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  x_twitter_url: z.string().optional(),
  facebook_url: z.string().optional(),
  personal_website_url: z.string().optional()
});

export type SocialSchema = z.infer<typeof socialSchema>;
