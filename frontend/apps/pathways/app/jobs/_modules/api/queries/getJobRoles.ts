import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { queryOptions } from '@tanstack/react-query';
import { Filters, GetJobRoleResponse } from '../../types';

export async function getJobRoles({
  queryKey
}: {
  queryKey: [string, Filters, string];
}) {
  const [, filters, limit] = queryKey;
  const response = await apiClientV2().post<
    AxiosResponse<GetJobRoleResponse[]>
  >(`/job-roles/pathways?limit=${limit || '10'}`, filters);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get job roles');
  }

  return response.data;
}

export const getJobRolesOptions = queryOptions({
  queryKey: ['jobRole', {} as Filters, 'limit'],
  queryFn: getJobRoles,
  retry: 3
});

export async function getJobRoleById({
  queryKey
}: {
  queryKey: [string, string];
}) {
  const [_, jobRoleId] = queryKey;
  const response = await apiClientV2().get<AxiosResponse<GetJobRoleResponse>>(
    `/job-role/public/${jobRoleId}`
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get job role');
  }

  return response.data;
}

export const getJobRoleByIdOptions = queryOptions({
  retry: 3,
  queryKey: ['jobRole', 'jobRoleId'],
  queryFn: getJobRoleById
});
