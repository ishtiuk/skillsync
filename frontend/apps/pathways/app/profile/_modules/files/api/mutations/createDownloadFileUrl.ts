import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';

import {
  CreateDownloadFileUrlRequest,
  CreateDownloadFileUrlResponse
} from '../../types';

export async function createDownloadFileUrl(
  payload: CreateDownloadFileUrlRequest
) {
  const response = await apiClientV2().post<
    AxiosResponse<CreateDownloadFileUrlResponse>
  >('/generate-download-url/user/files', payload);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to create file download URL');
  }

  return response.data;
}
