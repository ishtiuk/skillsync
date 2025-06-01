'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { navigationItems } from '@/lib/navigationItems';
import { Button } from '@workspace/ui/components/button';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { Typography } from '@workspace/ui/components/typography';
import { getJobRolesOptions } from './_modules/api/queries/getJobRoles';
import { JobPostCard } from '@workspace/ui/components/job-post-card/JobPostCard';
import { NavigationPageWrapper } from '@workspace/ui/components/navigation-page-wrapper';

import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createDownloadCompanyLogoUrl } from '../profile/_modules/api/mutations/company-logo/createDownloadCompanyLogoUrl';

export default function RolesPage() {
  const router = useRouter();
  const queryClient = getQueryClient();
  const { data: roles } = useQuery(getJobRolesOptions);

  const createDownloadCompanyLogoUrlMutation = useMutation({
    mutationFn: createDownloadCompanyLogoUrl,
    onError: error => console.log('error', error)
  });

  const onLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const getCompanyLogo = async (companyLogo: string) => {
    try {
      const res = await createDownloadCompanyLogoUrlMutation.mutateAsync({
        object_key: companyLogo,
        filename: companyLogo?.split('/').pop() || '',
        content_type: `image/${companyLogo?.split('.').pop()}`
      });

      return res.download_url;
    } catch (error) {
      console.error('Error getting company logo:', error);
      return '';
    }
  };

  const [companyLogos, setLogos] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    (async () => {
      if (!roles) return;

      const logoPromises = roles.map(async r => {
        if (!r.company_logo_url) return { id: r.id, url: '' };
        const url = await getCompanyLogo(r.company_logo_url);
        return { id: r.id, url };
      });

      const logos = await Promise.all(logoPromises);
      setLogos(logos.reduce((acc, { id, url }) => ({ ...acc, [id]: url }), {}));
    })();
  }, [roles]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavigationPageWrapper onClickCustom={onLogout} items={navigationItems}>
        <div className="w-full flex align-center px-12 pt-[30px] h-8 gap-x-4">
          <Typography variant="heading-md">Roles</Typography>
          {roles && roles.length > 0 && (
            <Button
              variant="secondary"
              label="Submit a Role"
              leftIcon="PlusCircle_bold"
              onClick={() => router.push('/roles/new-role')}
            />
          )}
        </div>

        {roles && roles.length <= 0 ? (
          <div
            style={{ height: 'calc(100vh - 64px)' }}
            className="flex flex-col items-center justify-center text-center text-neutral-n-500"
          >
            <Image
              width={400}
              height={400}
              className="mb-8"
              alt="Empty state"
              src={'/images/empty-state-roles.svg'}
            />

            <Typography
              variant="heading-md"
              className="mb-8 text-neutral-n-800"
            >
              Go ahead, post your first role!
            </Typography>

            <Typography
              variant="body"
              className="mb-4 text-neutral-n-800 w-[50%]"
            >
              Post your first job on Candid, its easy and fast! We’ll help you
              find the right candidate fast and easy.
            </Typography>

            <Button
              variant="secondary"
              label="Submit a Role"
              leftIcon="PlusCircle_bold"
              onClick={() => router.push('/roles/new-role')}
            />
          </div>
        ) : (
          <div className="flex w-full py-16 px-12 gap-4">
            {roles?.map(r => (
              <JobPostCard
                key={r.id}
                jobPostId={r.id}
                jobPostName={r.title}
                companyName={r.company_name}
                companyLogo={companyLogos[r.id] || ''}
                pathway={r.pathway.toLowerCase() as any}
                onClick={() => router.push(`/roles/${r.id}`)}
                workplace={r.workplace_type.toLowerCase() as any}
                jobType={r.position_type.toLowerCase().replace('-', '_') as any}
              />
            ))}
          </div>
        )}
      </NavigationPageWrapper>
    </HydrationBoundary>
  );
}
