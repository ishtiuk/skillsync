import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import {
  AuthResponse,
  LoginGoogleUserPayload
} from '@/app/login/_modules/types';

export async function loginGoogleUser(payload: LoginGoogleUserPayload) {
  const response = await apiClientV2().post<AxiosResponse<AuthResponse>>(
    '/auth/login/google',
    payload
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to login user using Google');
  }

  return response.data;
}
