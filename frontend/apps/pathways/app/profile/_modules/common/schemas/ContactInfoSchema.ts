import { z } from 'zod';

export const contactInfoSchema = z.object({
  birthday: z.string().optional(),
  phone_number: z.string().optional(),
  city: z.string().nonempty('Please provide a city.'),
  state: z.string().nonempty('Please provide a state.')
});

export type ContactInfoSchema = z.infer<typeof contactInfoSchema>;
