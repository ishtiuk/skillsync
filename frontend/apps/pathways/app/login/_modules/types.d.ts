export type LoginUserPayload = {
  email: string;
  password: string;
};

export type RegisterUserPayload = {
  email: string;
  password: string;
  last_name: string;
  first_name: string;
};

export type LoginGoogleUserPayload = {
  access_token: string;
  platform: 'pathways';
};

export type RegisterGoogleUserPayload = {
  email: string;
  last_name: string;
  provider: 'google';
  first_name: string;
  platform: 'pathways';
  access_token: string;
};

export type DefaultResponse = {
  message: string;
};

export type AuthResponse = {
  user?: User;
  message: string;
  access_token: string;
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
  name: string;
  email: string;
  locale: string;
  picture: string;
  given_name: string;
  family_name: string;
  verified_email: boolean;
};
