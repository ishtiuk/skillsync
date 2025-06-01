import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { queryOptions } from '@tanstack/react-query';
import { GetFilesResponse } from '../../types';

export async function getFiles() {
  const response =
    await apiClientV2().get<AxiosResponse<GetFilesResponse[]>>('/user/files');

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get files');
  }

  return response.data;
}

export const getFilesOptions = queryOptions({
  queryKey: ['file'],
  queryFn: getFiles,
  retry: 3
});
