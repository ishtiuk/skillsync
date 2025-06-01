import { AxiosResponse } from 'axios';
import { GetJobRoleResponse } from '../../types';
import apiClientV2 from '@/lib/api/apiClientV2';
import { queryOptions } from '@tanstack/react-query';

export async function getJobRoles() {
  const response =
    await apiClientV2().get<AxiosResponse<GetJobRoleResponse[]>>(
      '/job-roles/candid'
    );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get job roles');
  }

  return response.data;
}

export const getJobRolesOptions = queryOptions({
  queryKey: ['jobRole'],
  queryFn: getJobRoles,
  retry: 3
});
