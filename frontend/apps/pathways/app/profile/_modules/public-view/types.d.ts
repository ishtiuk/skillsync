export type PublicUser = {
  email: string;
  city?: string;
  state?: string;
  goals?: string[];
  country?: string;
  last_name?: string;
  first_name?: string;
  files?: PublicFile[];
  linkedin_url?: string;
  facebook_url?: string;
  x_twitter_url?: string;
  instagram_url?: string;
  career_summary?: string;
  current_career?: string;
  profile_picture_url?: string;
  personal_website_url?: string;
  job_experiences?: PublicExperience[];
};

export type PublicExperience = {
  end_year: number;
  logo_url: string;
  start_year: number;
  company_name: string;
  position_title: string;
  employment_type: string;
};

export type PublicFile = {
  file_name: string;
  file_url: string;
  file_type: string;
};
