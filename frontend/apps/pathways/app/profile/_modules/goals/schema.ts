import { z } from 'zod';

export const goalsSchema = z.object({
  name: z.string().min(1, { message: 'Please provide a goal name.' }),
  description: z.string().optional(),
  tasks: z.record(z.boolean()).optional(),
  type: z.enum(['networking', 'interviewing', 'compensation', 'organization'], {
    message: 'Please select a valid goal type.'
  })
});

export type GoalsSchema = z.infer<typeof goalsSchema>;
