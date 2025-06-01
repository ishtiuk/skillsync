import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { queryOptions } from '@tanstack/react-query';
import { GetTrackedJobResponse } from '../../types';

export async function getTrackedJobs() {
  const response =
    await apiClientV2().get<AxiosResponse<GetTrackedJobResponse[]>>('/jobs');

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get tracked jobs');
  }

  return response.data;
}

export const getTrackedJobsOptions = queryOptions({
  queryKey: ['trackedJobs'],
  queryFn: getTrackedJobs,
  retry: 3
});

export async function getTrackedJobById({
  queryKey
}: {
  queryKey: [string, string];
}) {
  const [_, trackedJobId] = queryKey;
  const response = await apiClientV2().get<
    AxiosResponse<GetTrackedJobResponse>
  >(`/jobs/${trackedJobId}`);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get tracked job');
  }

  return response.data;
}

export const getTrackedJobByIdOptions = queryOptions({
  retry: 3,
  queryKey: ['trackedJobs', 'trackedJobId'],
  queryFn: getTrackedJobById
});
