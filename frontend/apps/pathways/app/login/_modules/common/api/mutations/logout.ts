import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';

import { removeToken } from '@/lib/utils/token';
import { DefaultResponse } from '../../../types';

export async function logoutUser(): Promise<DefaultResponse | unknown> {
  try {
    const response = await apiClientV2().post<AxiosResponse>(
      '/auth/logout',
      {}
    );

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to logout user');
    }

    removeToken();
    return response.data as DefaultResponse;
  } catch (error: unknown) {
    console.error('Error logging out user:', error);
    throw error;
  }
}
