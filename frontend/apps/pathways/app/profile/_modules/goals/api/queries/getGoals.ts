import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { GetGoalResponse } from '../../types';
import { queryOptions } from '@tanstack/react-query';

export async function getGoals() {
  const response =
    await apiClientV2().get<AxiosResponse<GetGoalResponse[]>>('/goals');

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get goals');
  }

  return response.data;
}

export const getGoalsOptions = queryOptions({
  queryKey: ['goal'],
  queryFn: getGoals,
  retry: 3
});
