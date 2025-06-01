import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { type CreateExperienceRequest } from '../../types';
import { DefaultResponse } from '@/app/login/_modules/types';

export async function createExperience(payload: CreateExperienceRequest) {
  const response = await apiClientV2().post<AxiosResponse<DefaultResponse>>(
    '/user/experience',
    payload
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to create experience');
  }

  return response.data;
}
