import { AxiosResponse } from 'axios';
import apiClientV2 from '@/lib/api/apiClientV2';

import { GenerateCoverLetterRequest } from '../../types';

export async function generateCoverLetter(payload: GenerateCoverLetterRequest) {
  const response = await apiClientV2().post<
    AxiosResponse<{
      cover_letter: {
        paragraphs: string;
      };
    }>
  >('/generate', payload);

  if (response.status !== 200 && response.status !== 201) {
    throw new Error('Failed to generate cover letter');
  }

  return response.data;
}
