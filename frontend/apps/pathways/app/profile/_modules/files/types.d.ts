export type CreateUploadFileUrlRequest = {
  filename: string;
  content_type: string;
};

export type CreateDownloadFileUrlRequest = {
  filename: string;
  object_key: string;
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

export type CreateDownloadFileUrlResponse = {
  download_url: string;
};

export type GetFilesResponse = {
  file_url: 'string';
  file_name: 'string';
  file_type: 'string';
};
