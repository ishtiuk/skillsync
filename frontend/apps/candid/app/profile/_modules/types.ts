export type CreateCompanyRequest = {
  name: string;
  type: string;
  size: string;
  no_of_employees?: number;
  is_bipoc_owned?: boolean;
  location?: string;
  city?: string;
  state?: string;
  country: string;
  overview?: string;
  benefits?: string[];
  select_a_pathway: string;
  logo_url?: string;
};

export type GetCompanyResponse = {
  name: string;
  type: string;
  size: string;
  no_of_employees: number;
  is_bipoc_owned: boolean;
  location: string;
  city: string;
  state: string;
  country: string;
  overview: string;
  benefits: string[];
  select_a_pathway: string;
  logo_url: string;
  id: string;
  created_by: string;
};

export type CreateUploadFileUrlRequest = {
  filename: string;
  content_type: string;
};

export type CreateUploadFileRespnse = {
  upload_url: {
    url: string;
    fields: {
      key: string;
      policy: string;
      'x-amz-date': string;
      'Content-Type': string;
      'x-amz-algorithm': string;
      'x-amz-credential': string;
    };
  };
};

export type CreateDownloadFileUrlRequest = {
  filename?: string;
  object_key: string;
  content_type?: string;
};

export type CreateDownloadFileUrlResponse = {
  download_url: string;
};
