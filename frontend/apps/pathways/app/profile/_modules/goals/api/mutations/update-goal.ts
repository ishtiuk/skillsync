import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { type UpdateGoalRequest } from '../../types';
import { DefaultResponse } from '@/app/login/_modules/types';

export async function updateGoal(payload: UpdateGoalRequest) {
  const response = await apiClientV2().patch<AxiosResponse<DefaultResponse>>(
    `/goals/${payload.id}`,
    payload.request
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to update goal');
  }

  return response.data;
}
