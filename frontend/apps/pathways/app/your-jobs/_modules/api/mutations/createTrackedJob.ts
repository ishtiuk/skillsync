import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';

import { CreateTrackedJobRequest, GetTrackedJobResponse } from '../../types';

export async function createTrackedJob(payload: CreateTrackedJobRequest) {
  const response = await apiClientV2().post<
    AxiosResponse<GetTrackedJobResponse>
  >('/jobs', payload);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to create tracked job');
  }

  return response.data;
}
