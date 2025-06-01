import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { User } from '../../../../login/_modules/types';

export async function updateUserProfile(payload: User) {
  const response = await apiClientV2().put<AxiosResponse<User>>(
    '/user/update-user',
    payload
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to update user');
  }

  return response.data;
}
