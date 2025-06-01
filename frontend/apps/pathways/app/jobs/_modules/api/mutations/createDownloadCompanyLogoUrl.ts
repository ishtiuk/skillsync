import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import {
  CreateDownloadFileUrlRequest,
  CreateDownloadFileUrlResponse
} from '@/app/profile/_modules/files/types';

export async function createDownloadCompanyLogoUrl(
  payload: CreateDownloadFileUrlRequest
) {
  const response = await apiClientV2().post<
    AxiosResponse<CreateDownloadFileUrlResponse>
  >('/generate-download-url/company', payload);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to create company logo download URL');
  }

  return response.data;
}
