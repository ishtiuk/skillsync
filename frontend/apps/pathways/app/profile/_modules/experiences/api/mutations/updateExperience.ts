import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { type UpdateExperienceRequest } from '../../types';
import { DefaultResponse } from '@/app/login/_modules/types';

export async function updateExperience(payload: UpdateExperienceRequest) {
  const response = await apiClientV2().put<AxiosResponse<DefaultResponse>>(
    `/user/experience/${payload.id}`,
    payload.request
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to update experience');
  }

  return response.data;
}
