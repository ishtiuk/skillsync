import { z } from 'zod';

export const experienceSchema = z.object({
  position_title: z
    .string()
    .min(2, 'Position title must be at least 2 characters long')
    .max(100, 'Position title must be at most 100 characters long'),
  company_name: z
    .string()
    .min(2, 'Company name must be at least 2 characters long')
    .max(100, 'Company name must be at most 100 characters long'),
  employment_type: z.string().min(1, 'Employment type is required'),
  is_current: z.boolean().optional(),
  start_month: z.string().min(2, 'Start month is required'),
  start_year: z.string().min(2, 'Start year is required'),
  end_month: z.string().optional(),
  end_year: z.string().optional()
});

export type ExperienceSchema = z.infer<typeof experienceSchema>;
