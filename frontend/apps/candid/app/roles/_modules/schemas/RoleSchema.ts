import { optional, z } from 'zod';

export const roleSchema = z.object({
  title: z
    .string()
    .min(2, 'Role title must be at least 2 characters long')
    .max(100, 'Role title must be at most 100 characters long'),

  job_category: z.string().min(1, 'Job category is required'),

  position_type: z.string().min(1, 'Employment type is required'),
  level_of_experience: z.string().min(1, 'Level of experience is required'),

  role_description: z
    .string()
    .min(2, 'Description must be at least 2 characters long')
    .max(50000, 'Description must be at most 5000 characters long'),

  primary_responsibilities: z.string().optional(),

  required_qualifications: z.string().optional(),

  desired_qualifications: z.string().optional(),

  education_level: z.string().optional(),

  specific_education_requirements: z.string().optional(),

  workplace_type: z.string().min(1, 'Workplace type is required'),

  city: z.string().optional(),
  state: z.string().optional(),

  pay_type: z.string().optional(),
  minimum_pay: z.string().optional(),
  maximum_pay: z.string().optional(),

  pay_frequency: z.string().optional(),

  compensation_benefits: z.string().optional(),

  closing_date: z
    .string()
    .date('Closing date must be a valid date in the format DD-MM-YYYY'),

  show_recruiter: z.boolean().optional(),
  external_link: z.string().optional(),

  is_resume_required: z.boolean().optional(),
  is_portfolio_required: z.boolean().optional(),
  is_cover_letter_required: z.boolean().optional()
});

export type RoleSchema = z.infer<typeof roleSchema>;
