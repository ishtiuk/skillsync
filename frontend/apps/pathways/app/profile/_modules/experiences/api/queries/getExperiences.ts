import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { GetExperienceResponse } from '../../types';
import { queryOptions } from '@tanstack/react-query';

export async function getExperiences() {
  const response =
    await apiClientV2().get<AxiosResponse<GetExperienceResponse[]>>(
      '/user/experience'
    );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get experiences');
  }

  return response.data;
}

export const getExperiencesOptions = queryOptions({
  queryKey: ['experience'],
  queryFn: getExperiences,
  retry: 3
});
