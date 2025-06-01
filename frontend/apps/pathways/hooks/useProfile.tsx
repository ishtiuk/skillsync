import React, { useEffect } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserOptions } from '@/app/profile/_modules/common/api/queries/get-user';
import { CreateDownloadFileUrlResponse } from '@/app/profile/_modules/files/types';
import { createDownloadProfilePhotoUrl } from '@/app/profile/_modules/profile-photo/api/mutations/createDownloadProfilePhotoUrl';
import { User } from '@/app/profile/_modules/common/types';

const useProfile = (): {
  isError: boolean;
  isLoading: boolean;
  userData: User | undefined;
  profilePhoto: string | null;
} => {
  const { data: userData, isLoading, isError } = useQuery(getUserOptions);
  const [profilePhoto, setProfilePhoto] = React.useState<string | null>(null);

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

  useEffect(() => {
    if (
      userData?.profile_picture_url &&
      !sessionStorage.getItem('profilePhoto')
    )
      downloadProfilePhotoMutation.mutate({});
  }, [userData, userData?.profile_picture_url]);

  return {
    userData,
    isError,
    isLoading,
    profilePhoto
  };
};

export default useProfile;
