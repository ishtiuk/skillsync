export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  platform: 'careerforge' | 'talenthub';
  gender?: string;
  ethnicity?: string;
  nationality?: string;
  phone_number?: string;
  city?: string;
  state?: string;
  country?: string;
  birthday?: string;

  // Social Links
  linkedin_url?: string;
  github_url?: string;
  x_twitter_url?: string;
  personal_website_url?: string;

  // Professional Info
  current_career?: string;
  job_search_phase?: string;
  skills?: string[];
  interests?: string[];
  career_summary?: string;
  current_job_title?: string;

  // Media
  profile_picture_url?: string;
  profile_picture_download_url?: string;
  background_image_url?: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  platform: 'careerforge' | 'talenthub';
}

export interface LoginRequest {
  email: string;
  password: string;
  platform: 'careerforge' | 'talenthub';
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  platform: 'careerforge' | 'talenthub';
  provider?: string;
}
