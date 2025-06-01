import { z } from 'zod';

export const summarySchema = z.object({
  career_summary: z.string().optional()
});

export type SummarySchema = z.infer<typeof summarySchema>;
