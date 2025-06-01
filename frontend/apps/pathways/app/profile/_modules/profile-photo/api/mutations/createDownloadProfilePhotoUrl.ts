import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';
import { CreateDownloadFileUrlResponse } from '../../../files/types';

export async function createDownloadProfilePhotoUrl(payload: {}) {
  const response = await apiClientV2().post<
    AxiosResponse<CreateDownloadFileUrlResponse>
  >('/generate-download-url/user/profile', {});

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to create profile photo download URL');
  }

  return response.data;
}
