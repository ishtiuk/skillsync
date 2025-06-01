import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { GetCompanyResponse, CreateCompanyRequest } from '../../../types';

export async function updateCompany(
  payload: CreateCompanyRequest & { id: string }
) {
  const response = await apiClientV2().patch<AxiosResponse<GetCompanyResponse>>(
    `/company/${payload?.id}`,
    payload
  );

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to update company');
  }

  return response.data;
}
