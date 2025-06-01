import React, { useState } from 'react';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { ListItem } from '@workspace/ui/components/list-item/ListItem';
import SectionHeader from '@workspace/ui/components/section-header/SectionHeader';

import EmptyState from '../../../../../components/EmptyState';
import { Button } from '@workspace/ui/components/button';

import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import { usePathname } from 'next/navigation';
import { PublicFile } from '../types';

type ExperiencesProps = {
  files?: PublicFile[];
};

export const PublicFiles = ({ files }: ExperiencesProps) => {
  const pathname = usePathname();
  const queryClient = getQueryClient();

  const handleFileDownload = (file: PublicFile) => {
    window.open(file.file_url, '_blank');
  };

  if (!files || files.length === 0) return null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col border rounded-[16px] border-neutral-300 overflow-clip bg-white">
        <SectionHeader
          count={files && files?.length > 0 ? files?.length : undefined}
          title={'Files'}
          leftIconProps={{
            className: 'text-blue-b-400',
            iconVariant: 'Folder_fill'
          }}
          className="w-full"
        />

        {files && files?.length > 0
          ? files.map(file => (
              <ListItem
                key={file.file_name}
                title={file.file_name + '.pdf'}
                className="border-b border-neutral-300 last:border-b-0"
                ListItemRight={
                  <Button
                    label="Download"
                    variant="secondary"
                    onClick={() => handleFileDownload(file)}
                  />
                }
              />
            ))
          : null}
      </div>
    </HydrationBoundary>
  );
};
