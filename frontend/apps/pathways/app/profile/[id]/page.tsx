'use client';
import { ReactElement } from 'react';
import { usePathname } from 'next/navigation';

import Image from 'next/image';
import { Typography } from '@workspace/ui/components/typography';

import { cn } from '@workspace/ui/lib/utils';
import { Tag } from '@workspace/ui/components/tag';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { Button } from '@workspace/ui/components/button';
import { PublicFiles } from '../_modules/public-view/components/PublicFiles';
import { useQuery, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { AvatarPeople } from '@workspace/ui/components/avatar-people/AvatarPeople';
import { getPublicUserByIdOptions } from '../_modules/public-view/api/queries/getPublicProfile';
import { PublicExperiences } from '../_modules/public-view/components/PublicExperiences';
import Loader from '@workspace/ui/components/loader/Loader';

export default function ProfilePage(): ReactElement {
  const pathname = usePathname();
  const queryClient = getQueryClient();

  const {
    data: publicUserData,
    isLoading,
    isError
  } = useQuery({
    ...getPublicUserByIdOptions,
    queryKey: ['publicUser', pathname.split('/')[2] ?? ''],
    enabled: !!pathname.split('/')[2]
  });

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Typography variant="heading-lg" className="mb-8">
          User not found
        </Typography>
        <Button
          variant="primary"
          label="Go back to home"
          onClick={() => (window.location.href = '/home')}
        />
      </div>
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div
        data-testid="profile-background"
        className="h-64 p-12 flex flex-row gap-x-4 justify-end relative z-10"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: `url('/images/backgrounds/nature-background-1.svg')`
        }}
      ></div>

      <div
        data-testid="profile-content"
        className="bg-white relative -top-20 px-12 flex flex-col align-items-start align-self-stretch gap-3 py-6 -mb-20"
      >
        <div
          className={cn(
            'relative h-32 w-32 flex justify-center items-center z-20'
          )}
        >
          <div className="rounded-full border-[6px] border-white w-[128px] h-[128px] flex justify-center items-center box-content">
            <AvatarPeople
              size="128px"
              color="purple"
              avatarId="profile-picture"
              profileIMG={publicUserData?.profile_picture_url || undefined}
            />
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Typography variant="heading-lg">
            {publicUserData?.first_name} {publicUserData?.last_name}
          </Typography>

          <Tag
            minimaze={false}
            className="bg-blue-b-100 border-blue-b-100 text-blue-b-500 border-2 rounded-[23px] p-2 flex gap-2"
            TypographyProps={{ variant: 'caption-strong' }}
          >
            <Typography variant="caption-strong" className="font-bold">
              🎓 {publicUserData?.current_career}
            </Typography>
          </Tag>
        </div>
        <div className="flex gap-1 align-self-stretch align-items-center">
          <Typography variant="body" className="text-neutral-n-600">
            {publicUserData?.city}, {publicUserData?.state},{' '}
            {publicUserData?.country}
          </Typography>
        </div>
        <div className="flex flex-row items-center">
          {publicUserData?.instagram_url ||
          publicUserData?.linkedin_url ||
          publicUserData?.x_twitter_url ||
          publicUserData?.facebook_url ||
          publicUserData?.personal_website_url ? (
            <div className="flex gap-4 mr-4">
              {!!publicUserData?.facebook_url && (
                <a
                  href={publicUserData.facebook_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/socials/facebook-icon.svg"
                    alt="facebook"
                    width={18}
                    height={18}
                  />
                </a>
              )}
              {!!publicUserData?.linkedin_url && (
                <a
                  href={publicUserData.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/socials/linkedin-icon.svg"
                    alt="linkedin"
                    width={18}
                    height={18}
                  />
                </a>
              )}
              {!!publicUserData?.instagram_url && (
                <a
                  href={publicUserData.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/socials/instagram-icon.svg"
                    alt="instagram"
                    width={18}
                    height={18}
                  />
                </a>
              )}
              {!!publicUserData?.x_twitter_url && (
                <a
                  href={publicUserData.x_twitter_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/socials/x-icon.svg"
                    alt="twitter"
                    width={18}
                    height={18}
                  />
                </a>
              )}
              {!!publicUserData?.personal_website_url && (
                <a
                  href={publicUserData.personal_website_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src="/images/socials/personal-website-icon.svg"
                    alt="website"
                    width={18}
                    height={18}
                  />
                </a>
              )}
            </div>
          ) : null}
        </div>

        {!!publicUserData?.career_summary && (
          <div className="flex pt-6 pr-6 relative items-center self-stretch gap-4 w-full justify-between rounded-2xl bg-white">
            {/* CHANGE BG COLOR HERE */}
            <div className="flex flex-col justify-center items-start gap-2 w-full">
              <div className="flex justify-between w-full items-center">
                <Typography variant="body-strong">{'Summary'}</Typography>
              </div>

              <Typography variant="caption">
                {publicUserData?.career_summary}
              </Typography>
            </div>
          </div>
        )}

        <div className="flex pr-6 relative items-center self-stretch gap-4 w-full justify-between rounded-2xl bg-white">
          <div className="flex flex-col justify-center items-start gap-2 w-full">
            <div className="flex justify-between w-full items-center">
              <Typography variant="body-strong">Skills</Typography>
            </div>

            <div className="flex gap-2">
              {[
                'Figma',
                'Adobe Illustrator',
                'Adobe Photoshop',
                'Adobe InDesign',
                'Adobe XD',
                'Sketch',
                'Zeplin'
              ].map((skill, index) => (
                <Tag
                  minimaze={false}
                  TypographyProps={{ variant: 'caption' }}
                  className="bg-neutral-n-200 text-neutral-n-800 border-2 rounded-[8px] p-2 flex gap-2"
                >
                  <Typography variant="caption" className="font-medium">
                    {skill}
                  </Typography>
                </Tag>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="bg-neutral-100 flex flex-col gap-12 px-12 py-12"
        data-testid="application-data"
      >
        <PublicExperiences experiences={publicUserData?.job_experiences} />
        <PublicFiles files={publicUserData?.files} />
      </div>
    </HydrationBoundary>
  );
}
