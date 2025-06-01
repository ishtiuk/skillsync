import axios from 'axios';
import { GoogleUser } from '../../types';
import { GOOGLE_API_URL } from '@/lib/urls';

export async function getGoogleUser(access_token: string): Promise<GoogleUser> {
  const response = await axios.get(
    `${GOOGLE_API_URL}/userinfo?access_token=${access_token}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json'
      }
    }
  );

  return response.data as GoogleUser;
}
