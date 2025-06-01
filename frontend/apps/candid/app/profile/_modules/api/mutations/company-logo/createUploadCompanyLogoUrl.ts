import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';

import {
  CreateUploadFileRespnse,
  CreateUploadFileUrlRequest
} from '../../../types';

export async function createUploadCompanyLogoUrl(
  payload: CreateUploadFileUrlRequest
) {
  const response = await apiClientV2().post<
    AxiosResponse<CreateUploadFileRespnse>
  >('/generate-upload-url/company', payload);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to create company logo upload URL');
  }

  return response.data;
}
