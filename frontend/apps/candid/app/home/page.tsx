'use client';
import Image from 'next/image';
import { Suspense } from 'react';
import { ReactElement, useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography } from '@workspace/ui/components/typography';
import { NavigationPageWrapper } from '@workspace/ui/components/navigation-page-wrapper';

import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import { navigationItems } from '@/lib/navigationItems';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { getUserOptions } from '../login/_modules/api/queries/getUser';
import IntroBanner from './_modules/components/IntroBanner';
import HiringCard from './_modules/components/HiringCard';
import GetStartedCard from './_modules/components/GetStartedCard';

export default function HomePage(): ReactElement {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryClient = getQueryClient();
  const { data: userData, isLoading, isError } = useQuery(getUserOptions);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !userData) router.push('/login/existing-user');

  const onLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavigationPageWrapper onClickCustom={onLogout} items={navigationItems}>
        <div className="flex flex-col w-full max-w-full shrink">
          <div className="w-full flex justify-between align-center px-12 pt-[30px] pb-4">
            <Typography variant="heading-md">
              Good Afternoon, {userData?.first_name}!
            </Typography>
          </div>

          <div className="flex gap-x-2 px-12">
            <Button
              variant="primary"
              label="Post a Role"
              leftIcon="PlusCircle_bold"
              onClick={() => router.push('/roles/new-role')}
              className="bg-primary-g-800 text-primary-g-200 rounded-[16px]"
            />
            <Button
              variant="tertiary"
              label="Manage Roles"
              leftIcon="Briefcase_fill"
              onClick={() => router.push('/roles')}
              className="bg-neutral-n-200 text-primary-g-800 rounded-[16px]"
            />
          </div>
        </div>

        <IntroBanner />

        <div className="flex">
          <HiringCard />
          <GetStartedCard />
        </div>
      </NavigationPageWrapper>
    </HydrationBoundary>
  );
}
