import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { queryOptions } from '@tanstack/react-query';
import { PublicUser } from '../../types';

export async function getPublicUserById({
  queryKey
}: {
  queryKey: [string, string];
}) {
  const [_, userId] = queryKey;
  const response = await apiClientV2().get<AxiosResponse<PublicUser>>(
    `/user/public/${userId}`
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get public user');
  }

  return response.data;
}

export const getPublicUserByIdOptions = queryOptions({
  retry: 3,
  queryKey: ['publicUser', 'userId'],
  queryFn: getPublicUserById
});
