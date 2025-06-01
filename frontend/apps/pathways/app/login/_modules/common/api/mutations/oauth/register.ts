import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import {
  AuthResponse,
  RegisterGoogleUserPayload
} from '@/app/login/_modules/types';

export async function registerGoogleUser(payload: RegisterGoogleUserPayload) {
  const response = await apiClientV2().post<AxiosResponse<AuthResponse>>(
    '/user/google',
    payload
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to register user using Google');
  }

  return response.data;
}
