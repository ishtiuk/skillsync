import { optional, z } from 'zod';

export const companyProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must be at most 100 characters long'),

  select_a_pathway: z.string().min(1, 'Pathway is required'),

  type: z.string().min(1, 'Type is required'),

  size: z.string().min(1, 'Size is required'),
  no_of_employees: z.string().optional(),

  location: z.string().optional(),

  overview: z.string().optional(),

  city: z.string().optional(),
  state: z.string().optional(),

  is_bipoc_owned: z.boolean().optional(),

  benefits: z.array(z.string()).optional()
});

export type CompanyProfileSchema = z.infer<typeof companyProfileSchema>;
