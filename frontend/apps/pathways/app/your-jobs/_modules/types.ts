import { GetJobRoleResponse } from '@/app/jobs/_modules/types';

export type GetTrackedJobResponse = {
  id: string;
  notes: string;
  job_id: string;
  user_id: string;
  activity: string;
  reaction: string;
  created_at: string;
  updated_at: string;
  is_favourite: boolean;
  job_info: GetJobRoleResponse;
  stage: {
    [key: string]: boolean;
  };
};

export type CreateTrackedJobRequest = {
  notes: string;
  job_id: string;
  activity: string;
  reaction: string;
  is_favourite: boolean;
  stage: {
    [key: string]: boolean;
  };
};

export type GenerateCoverLetterRequest = {
  job_role_id: string;
  props: {
    [key: string]: string | number | boolean;
  };
};
