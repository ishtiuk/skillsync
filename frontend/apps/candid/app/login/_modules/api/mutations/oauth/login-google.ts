import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import {
  DefaultResponse,
  LoginGoogleUserPayload,
  LoginUserPayload
} from '../../../types';

export async function loginGoogleUser(payload: LoginGoogleUserPayload) {
  const response = await apiClientV2().post<AxiosResponse<DefaultResponse>>(
    '/auth/login/google',
    payload
  );

  return response.data;
}
