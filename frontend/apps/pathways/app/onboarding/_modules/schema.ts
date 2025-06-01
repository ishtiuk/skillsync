import { z } from 'zod';

export const onBoardingSchemaStep1 = z.object({
  gender: z.string().nonempty('Please select a Gender.'),
  ethnic_background: z.string().nonempty('Please select an ethnicity.'),
  phone_number: z.string().optional(),
  city: z.string().nonempty('Please provide a city.'),
  state: z.string().nonempty('Please provide a state.')
});

export const onBoardingSchemaStep2 = z.object({
  current_career: z.string().nonempty('Please select a career stage.'),
  job_search_phase: z.string().nonempty('Please select a job phase.'),
  interests: z.array(z.string()).optional()
});

export const skillsSchema = z.object({
  skill: z.string().optional()
});

export type OnBoardingSchemaStep1 = z.infer<typeof onBoardingSchemaStep1>;

export type OnBoardingSchemaStep2 = z.infer<typeof onBoardingSchemaStep2>;

export type SkillsSchema = z.infer<typeof skillsSchema>;
