import { AxiosResponse } from 'axios';
import { GetCompanyResponse } from '../../types';
import apiClientV2 from '@/lib/api/apiClientV2';
import { queryOptions } from '@tanstack/react-query';

export async function getCompany() {
  const response =
    await apiClientV2().get<AxiosResponse<GetCompanyResponse>>('/company');

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to get company');
  }

  return response.data;
}

export const getCompanyOptions = queryOptions({
  queryKey: ['company'],
  queryFn: getCompany,
  retry: 0
});
