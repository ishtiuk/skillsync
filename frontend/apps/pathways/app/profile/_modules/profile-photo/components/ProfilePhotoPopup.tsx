import React, { useState } from 'react';
import { Button } from '@workspace/ui/components/button';

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger,
  DialogDescription
} from '@workspace/ui/components/dialog/Dialog';

import { useForm } from 'react-hook-form';
import {
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';
import { Typography } from '@workspace/ui/components/typography';

import { getQueryClient } from '@/lib/api/getQueryClient';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { CreateDownloadFileUrlResponse } from '../../files/types';
import { IconButton } from '@workspace/ui/components/icon-button/IconButton';
import { AvatarPeople } from '@workspace/ui/components/avatar-people/AvatarPeople';
import { createUploadProfilePhotoUrl } from '../api/mutations/createUploadProfilePhotoUrl';
import { createDownloadProfilePhotoUrl } from '../api/mutations/createDownloadProfilePhotoUrl';

type UploadEvent = React.ChangeEvent<HTMLInputElement>;

type ProfilePhotoPopupProps = {
  open: boolean;
  profilePhoto: Blob | string | null;
  onOpenChange: (open: boolean) => void;
  setProfilePhoto: (image: string | null) => void;
};

const ProfilePhotoPopup = ({
  open,
  onOpenChange,
  profilePhoto,
  setProfilePhoto
}: ProfilePhotoPopupProps) => {
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [profilePhotoChild, setProfilePhotoChild] = useState<Blob | null>(null);

  const downloadProfilePhotoMutation = useMutation({
    mutationFn: createDownloadProfilePhotoUrl,
    onError: error => console.log('error', error),
    onSuccess: (data: CreateDownloadFileUrlResponse) => {
      if (data.download_url) {
        setProfilePhoto(data.download_url);
        sessionStorage.setItem('profilePhoto', data.download_url);
      }
    }
  });

  const handleCompanyLogoUpload = (event: UploadEvent) => {
    setProfilePhotoChild(event?.target?.files && event?.target?.files[0]);
  };

  const handleEditClick = () => {
    document.getElementById('upload-logo')?.click();
  };

  //   const handleSavePhoto = () => {
  //     setProfilePhoto(profilePhotoChild);
  //     onOpenChange(false);
  //   };

  const mutation = useMutation({
    mutationFn: createUploadProfilePhotoUrl,
    onError: error => setHasErrors(true)
  });

  const queryClient = getQueryClient();

  const resetAlerts = () => {
    setHasErrors(false);
    setIsSuccess(false);
  };

  const onSubmit = async () => {
    const res = await mutation.mutateAsync({
      filename: '',
      content_type: profilePhotoChild?.type || ''
    });

    if (res.upload_url.fields) {
      console.log('res.upload_url.fields', res.upload_url);

      const formData = new FormData();

      for (const key in res.upload_url.fields) {
        formData.append(
          key,
          res.upload_url.fields[key as keyof typeof res.upload_url.fields]
        );
      }

      formData.append('file', profilePhotoChild as Blob);

      try {
        const profilePhotoUploadRes = await fetch(res.upload_url.url, {
          method: 'POST',
          body: formData
        });

        await profilePhotoUploadRes.json();

        queryClient.invalidateQueries({ queryKey: ['user'] });
      } catch (error) {
        console.error('Error uploading file:', error);
      }

      sessionStorage.removeItem('profilePhoto');
      downloadProfilePhotoMutation.mutate({});
      onOpenChange(false);
    }
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild onClick={resetAlerts}>
          <IconButton
            size="small"
            variant="secondary"
            iconVariant={'PencilSimple_fill'}
            className={'bottom-0 right-0 absolute'}
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
          <DialogHeader className="mt-12">
            <DialogTitle>
              <Typography variant="heading-md" className="text-primary-g-900">
                Add your photo
              </Typography>
            </DialogTitle>

            <DialogDescription>
              <Typography variant="body" className="text-primary-g-900">
                Add a wonderful portrait of yourself to help others recognize
                you! Take or upload a photo of yourself. Max file size: 5mb.
                File type: .PNG and .JPG
              </Typography>
            </DialogDescription>

            {isSuccess && (
              <Alert
                variant="success"
                onClose={() => setIsSuccess(false)}
                label={'Your changes have been saved'}
              />
            )}

            {hasErrors && (
              <Alert
                variant="critical"
                onClose={() => setHasErrors(false)}
                label={'Please fill in all required fields'}
              />
            )}
          </DialogHeader>

          <div className="flex justify-center -ml-4">
            <AvatarPeople
              size="128px"
              color="purple"
              className="cursor-pointer"
              avatarId="profile-picture"
              onClick={() => handleEditClick()}
              profileIMG={
                profilePhotoChild
                  ? URL.createObjectURL(profilePhotoChild)
                  : profilePhoto
                    ? (profilePhoto as string)
                    : '/images/profile-avatar.png'
              }
            />
          </div>

          <DialogFooter className="sm:justify-end mt-8">
            <DialogClose asChild>
              <Button type="button" variant="tertiary" label="Cancel" />
            </DialogClose>

            {profilePhotoChild ? (
              <Button
                type="button"
                variant="primary"
                label="Save Photo"
                onClick={() => onSubmit()}
              />
            ) : (
              <Button
                type="button"
                variant="primary"
                label="Upload Photo"
                onClick={handleEditClick}
              />
            )}

            <input
              type="file"
              id="upload-logo"
              accept="image/*"
              className={`hidden absolute cursor-pointer`}
              onChange={(e: UploadEvent) => handleCompanyLogoUpload(e)}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HydrationBoundary>
  );
};

export default ProfilePhotoPopup;
