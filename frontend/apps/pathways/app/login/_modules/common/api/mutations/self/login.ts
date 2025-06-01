import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { AuthResponse, LoginUserPayload } from '@/app/login/_modules/types';

export async function loginUser(payload: LoginUserPayload) {
  const response = await apiClientV2().post<AxiosResponse<AuthResponse>>(
    '/auth/login/self',
    payload
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to login user');
  }

  return response.data;
}
