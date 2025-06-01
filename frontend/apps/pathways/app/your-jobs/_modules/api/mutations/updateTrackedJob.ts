import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';

import {
  type GetTrackedJobResponse,
  type CreateTrackedJobRequest
} from '../../types';

export async function updateTrackedJob(
  payload: Partial<CreateTrackedJobRequest>
) {
  const response = await apiClientV2().patch<
    AxiosResponse<GetTrackedJobResponse>
  >(`/jobs/${payload.job_id}`, payload);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to update tracked job');
  }

  return response.data;
}
