export type LoginUserPayload = {
  email: string;
  password: string;
};

export type RegisterUserPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type LoginGoogleUserPayload = {
  access_token: string;
  platform: 'pathways';
};

export type RegisterGoogleUserPayload = {
  access_token: string;
  first_name: string;
  last_name: string;
  provider: 'google';
  platform: 'pathways';
  email: string;
};

export type User = {
  id: string;
  email: string;
  provider: string;
  platform: string;
  first_name: string;
  last_name: string;
  gender: string;
  ethnicity: string;
  nationality: string;
  phone_number: string;
  city: string;
  state: string;
  country: string;
  linkedin_url: string;
  instagram_url: string;
  facebook_url: string;
  x_twitter_url: string;
  personal_website_url: string;
  current_career: string;
  job_search_phase: string;
  goals: string[];
  interests: string[];
  career_summary: string;
  birthday: string;
  current_job_title: string;
  background_image_url: string;
  profile_picture_url?: string;
};

export type DefaultResponse = {
  message: string;
};

export type GoogleTokenResponse = {
  scope: string;
  prompt: string;
  expires_in: number;
  token_type: string;
  access_token: string;
};

export type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};
