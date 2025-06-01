import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { CreateGoalRequest } from '../../types';

export async function createGoal(payload: CreateGoalRequest) {
  const response = await apiClientV2().post<AxiosResponse<CreateGoalRequest>>(
    '/goals',
    payload
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to create goal');
  }

  return response.data;
}
