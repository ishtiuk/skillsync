export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const GOOGLE_API_URL = 'https://www.googleapis.com/oauth2/v1';
export const COUNTRY_STATE_CITY_API_URL = 'https://api.countrystatecity.in/v1';

export const GOOGLE_CLIENT_ID =
  '1088263438377-dmlda7hf5q3pnn4jv6kqddshcddjsh2u.apps.googleusercontent.com';

export const COUNTRY_STATE_CITY_API_KEY =
  'UnJCdXptMUNYV2EwMnBCd0NnWDVuUm9mWDFsMzhydGtmMEFyS2ZsVA==';

export const getApiUrl = (endpoint: string) => BASE_URL + endpoint;
