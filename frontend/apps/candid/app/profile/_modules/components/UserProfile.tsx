'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { Typography } from '@workspace/ui/components/typography';

import { Form, TextInput } from '@workspace/ui/components/form';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/api/getQueryClient';

import { updateUserProfile } from '../api/mutations/update-profile';
import { getUserOptions } from '@/app/login/_modules/api/queries/getUser';
import { AvatarPeople } from '@workspace/ui/components/avatar-people/AvatarPeople';
import {
  userProfileSchema,
  UserProfileSchema
} from '../schemas/UserProfileSchema';
import { createUploadProfilePhotoUrl } from '../api/mutations/profile-photo/createUploadProfilePhotoUrl';
import {
  CreateDownloadFileUrlResponse,
  CreateUploadFileRespnse
} from '../types';
import { createDownloadProfilePhotoUrl } from '../api/mutations/profile-photo/createDownloadProfilePhotoUrl';

const UserProfile = () => {
  const queryClient = getQueryClient();
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { data: userData, isLoading } = useQuery(getUserOptions);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profilePhotoChild, setProfilePhotoChild] = useState<File | null>(null);

  type UploadEvent = React.ChangeEvent<HTMLInputElement>;

  const updateUserMutation = useMutation({
    mutationFn: updateUserProfile,
    onError: error => setHasErrors(true),
    onSuccess: () => {
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  const mutation = useMutation({
    mutationFn: createUploadProfilePhotoUrl,
    onError: error => setHasErrors(true),
    onSuccess: (data: CreateUploadFileRespnse) => {
      console.log('data', data);
    }
  });

  const downloadMutation = useMutation({
    mutationFn: createDownloadProfilePhotoUrl,
    onError: error => console.log('error', error),
    onSuccess: (data: CreateDownloadFileUrlResponse) => {
      if (data.download_url) {
        setProfilePhoto(data.download_url);
      }
    }
  });

  const form = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),

    defaultValues: {
      email: '',
      last_name: '',
      first_name: '',
      current_job_title: ''
    },

    mode: 'onSubmit'
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        email: userData.email || '',
        last_name: userData.last_name || '',
        first_name: userData.first_name || '',
        current_job_title: userData.current_job_title || ''
      });

      if (userData?.profile_picture_url) downloadMutation.mutate({});
    }
  }, [userData, form.reset]);

  const handleEditClick = () => {
    document.getElementById('upload-logo')?.click();
  };

  const handleSubmit = form.handleSubmit(async data => {
    if (!userData) return;

    updateUserMutation.mutate({
      ...userData,
      ...data
    });
  });

  const handleCompanyLogoUpload = async (e: UploadEvent) => {
    const res = await mutation.mutateAsync({
      filename: '',
      content_type: (e?.target.files && e?.target?.files[0].type) || ''
    });

    if (res.upload_url.fields) {
      const formData = new FormData();

      for (const key in res.upload_url.fields) {
        formData.append(
          key,
          res.upload_url.fields[key as keyof typeof res.upload_url.fields]
        );
      }

      formData.append(
        'file',
        (e?.target?.files && (e?.target?.files[0] as Blob)) || ''
      );

      console.log(res.upload_url.url);

      try {
        const profilePhotoUploadRes = await fetch(res.upload_url.url, {
          method: 'POST',
          body: formData
        });

        const profilePhotoUploadResData = await profilePhotoUploadRes.json();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          noValidate
          onSubmit={(e?: BaseSyntheticEvent) => e?.preventDefault()}
          className="flex w-full py-6 px-12 items-start gap-6 bg-neutral-n-100"
        >
          <div className="flex flex-col items-start gap-6 flex-1 bg-white p-6 basis-2/3 border border-solid rounded-2xl w-full">
            <div className="flex items-center gap-2">
              <PhosphorIcon
                size={24}
                iconVariant="User_fill"
                className="fill-neutral-n-500"
              />
              <Typography variant="body-strong">User Information</Typography>
            </div>

            {hasErrors && (
              <div className="w-full">
                <Alert
                  variant="critical"
                  className="w-full"
                  onClose={() => setHasErrors(false)}
                  label={'Please fill in all required fields'}
                />
              </div>
            )}

            {isSuccess && (
              <div className="w-full">
                <Alert
                  variant="success"
                  className="w-full"
                  onClose={() => setHasErrors(false)}
                  label={'Company profile updated successfully'}
                />
              </div>
            )}

            <div className="flex justify-between items-center w-full bg-neutral-n-100 p-4 rounded-[16px]">
              <div className="flex items-center gap-4">
                {!profilePhotoChild && (
                  <AvatarPeople
                    size="96px"
                    color="purple"
                    avatarId={userData?.id!}
                    profileIMG={profilePhoto!}
                  />
                )}

                {profilePhotoChild && (
                  <Image
                    width={64}
                    height={64}
                    alt="Selected image"
                    src={URL.createObjectURL(profilePhotoChild)}
                  />
                )}

                {!userData?.profile_picture_url && (
                  <Typography variant="body" className="w-[80%]">
                    Your profile photo will be visible to job seekers looking to
                    apply at your company.
                  </Typography>
                )}
              </div>

              <Button
                variant="tertiary"
                onClick={handleEditClick}
                leftIcon={
                  profilePhotoChild || userData?.profile_picture_url
                    ? 'PencilSimpleLine_bold'
                    : 'PlusCircle_bold'
                }
                label={
                  profilePhotoChild || userData?.profile_picture_url
                    ? 'Change Profile Photo'
                    : 'Upload Profile Photo'
                }
              />
              <input
                type="file"
                id="upload-logo"
                accept="image/*"
                className={`hidden absolute cursor-pointer`}
                onChange={(e: UploadEvent) => handleCompanyLogoUpload(e)}
              />
            </div>

            <div className="w-full flex flex-col gap-4">
              <div className="flex gap-4">
                <TextInput
                  type="text"
                  fieldName="first_name"
                  placeholder="First Name"
                />

                <TextInput
                  type="text"
                  fieldName="last_name"
                  placeholder="Last Name"
                />
              </div>

              <div className="flex gap-4">
                <TextInput
                  type="text"
                  fieldName="email"
                  placeholder="Email Address"
                />

                <TextInput
                  type="text"
                  placeholder="Job Title"
                  fieldName="current_job_title"
                />
              </div>
            </div>
            <Button
              className="-ml-3"
              variant="tertiary"
              label="Save Changes"
              onClick={() => handleSubmit()}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserProfile;
