import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { DefaultResponse } from '@/app/login/_modules/types';

export async function deleteExperience(id: string) {
  const response = await apiClientV2().delete<AxiosResponse<DefaultResponse>>(
    `/user/experience/${id}`
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to delete experience');
  }

  return response.data;
}
