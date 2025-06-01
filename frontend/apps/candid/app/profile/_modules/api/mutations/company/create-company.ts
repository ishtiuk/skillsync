import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { type CreateCompanyRequest } from '../../../types';
import { DefaultResponse } from '@/app/login/_modules/types';

export async function createCompany(payload: CreateCompanyRequest) {
  const response = await apiClientV2().post<AxiosResponse<DefaultResponse>>(
    '/company',
    payload
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to create job role');
  }

  return response.data;
}
