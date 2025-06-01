import axios from 'axios';

import { GOOGLE_API_URL } from '@/lib/constants/urls';
import { GoogleUser } from '../../../types';

export async function getGoogleUser(access_token: string): Promise<GoogleUser> {
  try {
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
  } catch (error: unknown) {
    console.error('Error getting user:', error);
    throw error;
  }
}
