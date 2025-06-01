import React, { useState } from 'react';
import Image from 'next/image';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent
} from '@workspace/ui/components/dialog/Dialog';

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  ThreadsShareButton
} from 'react-share';

import { dehydrate, HydrationBoundary, useQuery } from '@tanstack/react-query';
import { Typography } from '@workspace/ui/components/typography';
import { getUserOptions } from '../api/queries/get-user';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { Alert } from '@workspace/ui/components/alert/Alert';

type ShareProfilePopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ShareProfilePopup = ({ open, onOpenChange }: ShareProfilePopupProps) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const queryClient = getQueryClient();
  const { data: userData } = useQuery(getUserOptions);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/profile/${userData?.id}`
    );
    setIsSuccess(true);
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
          <DialogHeader className="mt-12">
            <DialogTitle>
              <Typography variant="heading-md" className="text-primary-g-900">
                Share your profile
              </Typography>
            </DialogTitle>

            {isSuccess && (
              <Alert
                variant="success"
                onClose={() => setIsSuccess(false)}
                label={'Link has been copied to clipboard'}
              />
            )}
          </DialogHeader>

          <div className="flex flex-row items-center">
            {userData?.id ? (
              <div className="flex gap-4 mr-4">
                <FacebookShareButton
                  url={`${process.env.NEXT_PUBLIC_HOST_NAME}/profile/${userData.id}`}
                >
                  <Image
                    width={18}
                    height={18}
                    alt="facebook"
                    src="/images/socials/facebook-icon.svg"
                  />
                </FacebookShareButton>

                <LinkedinShareButton
                  url={`${process.env.NEXT_PUBLIC_HOST_NAME}/profile/${userData.id}`}
                >
                  <Image
                    src="/images/socials/linkedin-icon.svg"
                    alt="linkedin"
                    width={18}
                    height={18}
                  />
                </LinkedinShareButton>

                <TwitterShareButton
                  url={`${process.env.NEXT_PUBLIC_HOST_NAME}/profile/${userData.id}`}
                >
                  <Image
                    src="/images/socials/x-icon.svg"
                    alt="twitter"
                    width={18}
                    height={18}
                  />
                </TwitterShareButton>

                <span onClick={handleCopyLink} className="cursor-pointer">
                  <Image
                    src="/images/socials/personal-website-icon.svg"
                    alt="website"
                    width={18}
                    height={18}
                  />
                </span>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </HydrationBoundary>
  );
};

export default ShareProfilePopup;
