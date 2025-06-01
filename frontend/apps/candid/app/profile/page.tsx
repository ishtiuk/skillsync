'use client';
import { ReactElement, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
import { NavigationPageWrapper } from '@workspace/ui/components/navigation-page-wrapper';

import { getQueryClient } from '@/lib/api/getQueryClient';
import { getUserOptions } from '../login/_modules/api/queries/getUser';

import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import { navigationItems } from '@/lib/navigationItems';
import CompanyProfile from './_modules/components/CompanyProfile';
import { Typography } from '@workspace/ui/components/typography';
import UserProfile from './_modules/components/UserProfile';

export default function ProfilePage(): ReactElement {
  const router = useRouter();
  const queryClient = getQueryClient();
  const [tab, setTab] = useState('user-profile');
  //   const { data: userData, isLoading, isError } = useQuery(getUserOptions);

  const onLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  //   if (isLoading) return <div>Loading...</div>;
  //   if (isError || !userData) router.push('/login');

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavigationPageWrapper onClickCustom={onLogout} items={navigationItems}>
        <div className="w-full flex justify-between align-center px-12 pt-[30px] pb-6">
          <Typography variant="heading-md">Your Profile</Typography>
        </div>

        <div className="flex gap-4 px-12">
          <button
            onClick={() => setTab('user-profile')}
            className={`shadow-customShadow p-4 rounded-[16px] ${
              tab === 'user-profile'
                ? 'bg-white text-primary-g-800'
                : 'bg-neutral-n-300 text-neutral-n-500'
            }`}
          >
            <Typography variant="caption-strong">
              Personal Information
            </Typography>
          </button>

          <button
            onClick={() => setTab('company-profile')}
            className={`shadow-customShadow p-4 rounded-[16px] ${
              tab === 'company-profile'
                ? 'bg-white text-primary-g-800'
                : 'bg-neutral-n-300 text-neutral-n-500'
            }`}
          >
            <Typography variant="caption-strong">
              Company Information
            </Typography>
          </button>
        </div>

        {tab === 'user-profile' && <UserProfile />}
        {tab === 'company-profile' && <CompanyProfile />}
      </NavigationPageWrapper>
    </HydrationBoundary>
  );
}
