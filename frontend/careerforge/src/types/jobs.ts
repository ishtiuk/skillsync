
export interface Position {
  id: string;
  title: string;
  job_category: string;
  position_type: string;
  level_of_experience: string;
  role_description?: string;
  education_level?: string;
  special_educational_requirements?: string;
  workplace_type?: string;
  city?: string;
  state?: string;
  country?: string;

  // Compensation
  pay_type?: string;
  minimum_pay?: number;
  maximum_pay?: number;
  pay_frequency?: string;
  compensation_benefits?: string;

  // Additional Details
  closing_date?: string;
  external_link?: string;
  required_files?: string[];
  status?: string;
  primary_responsibilities?: string;
  required_qualifications?: string;
  desired_qualifications?: string;

  // Organization Info
  organization_name: string;
  organization_logo_url?: string;
  is_bipoc_owned?: boolean;

  // Recruiter Info
  recruiter_name?: string;
  recruiter_job_title?: string;
  recruiter_email?: string;
  recruiter_profile_picture_url?: string;
}

export interface JobStage {
  saved: boolean;
  applied: boolean;
  'interview-1'?: boolean;
  'interview-2'?: boolean;
  'interview-3'?: boolean;
  offer: boolean;
  hired: boolean;
  'past-roles': boolean;
  ineligible: boolean;
}

export interface TrackedJob {
  id: string;
  user_id: string;
  job_id: string;
  activity?: string;
  reaction?: string;
  notes?: string;
  is_favourite: boolean;
  created_at: string;
  updated_at: string;
  stage: JobStage;
  job_info: Position;
}
