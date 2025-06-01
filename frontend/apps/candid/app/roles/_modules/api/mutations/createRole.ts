import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { type CreateJobRoleRequest } from '../../types';
import { DefaultResponse } from '@/app/login/_modules/types';

export async function createJobRole(payload: CreateJobRoleRequest) {
  const response = await apiClientV2().post<AxiosResponse<DefaultResponse>>(
    '/job-role',
    payload
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to create job role');
  }

  return response.data;
}
