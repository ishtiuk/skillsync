import React, { useState } from 'react';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { ListItem } from '@workspace/ui/components/list-item/ListItem';
import SectionHeader from '@workspace/ui/components/section-header/SectionHeader';

import UploadFilesForm from './UploadFileForm';
import { Button } from '@workspace/ui/components/button';
import { getFilesOptions } from '../api/queries/getFiles';
import EmptyState from '../../../../../components/EmptyState';

import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import { CreateDownloadFileUrlResponse, GetFilesResponse } from '../types';
import { createDownloadFileUrl } from '../api/mutations/createDownloadFileUrl';

type ExperiencesProps = {};

export const Files = ({}: ExperiencesProps) => {
  const queryClient = getQueryClient();
  const [openUploadFilesModal, setOpenUploadFilesModal] = useState(false);

  const downloadMutation = useMutation({
    mutationFn: createDownloadFileUrl,
    onError: error => console.log('error', error),
    onSuccess: (data: CreateDownloadFileUrlResponse) => {
      window.open(data.download_url, '_blank');
    }
  });

  const { data: files } = useQuery({ ...getFilesOptions });

  if (!files) return null;

  const handleFileDownload = (file: GetFilesResponse) => {
    downloadMutation.mutate({
      filename: file.file_name,
      object_key: file.file_url,
      content_type: file.file_type
    });
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col border rounded-[16px] border-neutral-300 overflow-clip bg-white">
        <SectionHeader
          count={files && files?.length > 0 ? files?.length : undefined}
          title={'Your files'}
          leftIconProps={{
            className: 'text-blue-b-400',
            iconVariant: 'Folder_fill'
          }}
          rightButtonProps={{
            variant: 'tertiary',
            label: 'Upload your files',
            leftIcon: 'UploadSimple_fill',
            onClick: () => setOpenUploadFilesModal(true)
          }}
          className="w-full"
        />

        {files && files?.length > 0 ? (
          files?.map(file => (
            <ListItem
              key={file.file_name}
              title={file.file_name + '.pdf'}
              className="border-b border-neutral-300 last:border-b-0"
              ListItemRight={
                <Button
                  variant="secondary"
                  label="Preview File"
                  onClick={() => handleFileDownload(file)}
                />
              }
            />
          ))
        ) : (
          <EmptyState
            callToAction={
              <Button
                className="w-fit"
                variant="secondary"
                label="Upload Files"
                onClick={() => setOpenUploadFilesModal(true)}
              />
            }
            title="Nothing here yet."
            imageUrl="/images/empty-state-file-upload.svg"
            description={'This user has not uploaded any files yet.'}
          />
        )}

        <UploadFilesForm
          files={files || []}
          open={openUploadFilesModal}
          onOpenChange={setOpenUploadFilesModal}
        />
      </div>
    </HydrationBoundary>
  );
};
