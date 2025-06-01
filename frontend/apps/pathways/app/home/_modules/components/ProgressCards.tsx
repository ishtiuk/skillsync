'use client';
import { AvatarCompany } from '@workspace/ui/components/avatar-company/AvatarCompany';
import { Button } from '@workspace/ui/components/button';
import {
  Job,
  JOB_STAGE_STYLES
} from '@workspace/ui/components/jobs-table/types';
import { ListItem } from '@workspace/ui/components/list-item/ListItem';
import SectionHeader from '@workspace/ui/components/section-header/SectionHeader';
import { getYourJobs } from '@/mocks/getMockJobs';
import { useRouter } from 'next/navigation';
import React from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { PhosphorIcon, PhosphorIconProps } from '@/icons/PhosphorIcon';
import { Typography } from '@workspace/ui/components/typography';

type ProgressCardsProps = {
  jobs: Job[];
};
export const ProgressCards = ({ jobs }: ProgressCardsProps) => {
  //   const jobs = getYourJobs();

  return (
    <div className="flex py-6 px-12 justify-between bg-neutral-n-100 gap-4 shrink">
      <ProgressCard variant="saved" jobs={jobs} />
      <ProgressCard variant="interview" jobs={jobs} />
    </div>
  );
};

interface ProgressCardProps {
  variant: 'saved' | 'interview';
  jobs?: Job[];
}

const ProgressCard = ({ variant, jobs }: ProgressCardProps) => {
  const router = useRouter();

  // show only the most recent two jobs of the variant
  const stagedJobs = jobs?.filter(
    job => !!job.stage && job.stage.startsWith(variant)
  );
  const topTwoJobs = stagedJobs
    ?.sort((a, b) => (a.lastEdited > b.lastEdited ? -1 : 1))
    .slice(0, 2);
  // TODO: grab corresponding jobs from either saved or interviewing category
  const onClickManageJobs = () => {
    router.push('/your-jobs');
  };

  //   const ListItemRight =
  //     variant === 'saved' ? (
  //       <Button variant="secondary" size="default" label={'View Job'} />
  //     ) : (
  //       <Button variant="secondary" size="default" label={'Contact Employer'} />
  //     );

  return (
    <div className="rounded-2xl min-w-[520px] flex-1 bg-white">
      <SectionHeader
        title={JOB_STAGE_STYLES[variant].title}
        leftIconProps={JOB_STAGE_STYLES[variant].iconProps}
        count={stagedJobs?.length}
        rightButtonProps={{ label: 'Manage Jobs', onClick: onClickManageJobs }}
      />
      {topTwoJobs && topTwoJobs?.length > 0 ? (
        topTwoJobs?.map(job => (
          <ListItem
            title={job.title}
            header={'Sep 12'}
            subTitle={job.company}
            ContentImage={
              <AvatarCompany
                size={'48px'}
                avatarId={''}
                profileIMG={job.image}
                companyName={job.company}
              />
            }
            className="border-b border-neutral-300 last:border-b-0"
            key={job.jobId}
            ListItemRight={
              variant === 'saved' ? (
                <Button
                  variant="secondary"
                  size="default"
                  label={'View Job'}
                  onClick={() => router.push(`/jobs/${job.jobId}`)}
                />
              ) : (
                // <Button
                //   variant="secondary"
                //   size="default"
                //   label={'Contact Employer'}
                // />
                <></>
              )
            }
          />
        ))
      ) : (
        <div
          className={cn(
            'flex flex-col items-center justify-center w-full text-neutral-n-500 py-8 mb-8'
          )}
        >
          <div
            className={cn(
              'rounded-md group-hover:border-0 flex items-center justify-center h-6 w-6 mb-2',
              JOB_STAGE_STYLES[variant]?.emptyState?.className
            )}
          >
            <PhosphorIcon
              size={18}
              className={cn(JOB_STAGE_STYLES[variant]?.emptyState?.className)}
              iconVariant={
                JOB_STAGE_STYLES[variant]?.iconProps
                  .iconVariant as PhosphorIconProps['iconVariant']
              }
            />
          </div>

          <Typography
            variant="body-strong"
            className={cn('text-neutral-n-700')}
          >
            {JOB_STAGE_STYLES[variant]?.emptyState?.title || 'No jobs found'}
          </Typography>

          <Typography
            variant="caption"
            className={cn('text-neutral-n-600 text-center w-[50%]')}
          >
            {JOB_STAGE_STYLES[variant]?.emptyState?.description ||
              'No jobs found in this stage.'}
          </Typography>
        </div>
      )}
    </div>
  );
};
