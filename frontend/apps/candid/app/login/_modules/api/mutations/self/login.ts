import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { DefaultResponse, LoginUserPayload } from '../../../types';

export async function loginUser(payload: LoginUserPayload) {
  const response = await apiClientV2().post<AxiosResponse<DefaultResponse>>(
    '/auth/login/self',
    payload
  );

  return response.data;
}
