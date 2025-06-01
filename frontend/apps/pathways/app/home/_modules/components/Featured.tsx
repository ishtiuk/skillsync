import { Button } from '@workspace/ui/components/button';
import { JobPostCard } from '@workspace/ui/components/job-post-card/JobPostCard';
import {
  Job,
  WorkplaceTypeLabelMap
} from '@workspace/ui/components/jobs-table/types';
import { Typography } from '@workspace/ui/components/typography';
import { getFeaturedJobs } from '@/mocks/getMockJobs';
import React from 'react';
import { useRouter } from 'next/navigation';
import { GetJobRoleResponse } from '@/app/jobs/_modules/types';
import { industryTypeLabelMap } from '@workspace/ui/components/pathways-tag/PathwaysTag';
import { JobCategoryTag } from '@workspace/ui/components/job-category-tag/JobCategoryTag';

type FeaturedProps = {
  jobs: GetJobRoleResponse[];
};

export const Featured = ({ jobs }: FeaturedProps) => {
  const router = useRouter();
  //   const jobs = getFeaturedJobs();

  const onSave = (job: GetJobRoleResponse) => {};

  return (
    <div className="flex flex-col p-12 gap-6 bg-neutral-n-100">
      <div className="flex justify-between">
        <Typography variant="heading-sm">{'Featured Jobs'}</Typography>
        <Button
          variant="secondary"
          label="View all jobs"
          rightIcon="ArrowCircleRight_fill"
          onClick={() => router.push('/jobs')}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full justify-between gap-3">
        {jobs
          ?.map(job => {
            return (
              <JobPostCard
                badge={'featured'}
                jobPostId={job.id}
                key={`job-${job.id}`}
                jobPostName={job.title}
                cardVariant="medium-flex"
                onSave={() => onSave(job)}
                companyName={job.company_name}
                className="col-span-1 row-span-1"
                workplace={job.workplace_type.toLowerCase() as any}
                pathway={job.pathway.toLowerCase().replace(' ', '-') as any}
                jobType={
                  job.position_type.toLowerCase().replace('-', '_') as any
                }
              />
            );
          })
          .slice(0, 9)}
      </div>
    </div>
  );
};
