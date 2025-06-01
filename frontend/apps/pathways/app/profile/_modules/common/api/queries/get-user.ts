import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { queryOptions } from '@tanstack/react-query';
import { User } from '../../types';

export async function getUser(): Promise<User> {
  try {
    const response = await apiClientV2().get<AxiosResponse>('/user/me');

    if (response.status !== 200 && response.status !== 201) {
      throw new Error('Failed to get user');
    }

    return response.data as User;
  } catch (error: unknown) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export const getUserOptions = queryOptions({
  queryKey: ['user'],
  queryFn: getUser
});
