import { User } from '../../types';
import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { queryOptions } from '@tanstack/react-query';

export async function getUser() {
  const response = await apiClientV2().get<AxiosResponse<User>>('/user/me');

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get user');
  }

  return response.data;
}

export const getUserOptions = queryOptions({
  queryKey: ['user'],
  queryFn: getUser
});
