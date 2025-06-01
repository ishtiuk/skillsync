import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { AuthResponse, RegisterUserPayload } from '@/app/login/_modules/types';

export async function registerUser(payload: RegisterUserPayload) {
  const response = await apiClientV2().post<AxiosResponse<AuthResponse>>(
    '/user/self',
    payload
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to register user');
  }

  return response.data;
}
