'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getYourJobs } from '@/mocks/getMockJobs';
import { navigationItems } from '@/lib/constants/navigationItems';
import { ReactElement, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Typography } from '@workspace/ui/components/typography';
import JobsTable from '@workspace/ui/components/jobs-table/JobsTable';

import {
  Job,
  JobStage,
  JOB_STAGES
} from '@workspace/ui/components/jobs-table/types';

import { ProgressSteps } from '@workspace/ui/components/progress-steps/ProgressSteps';
import { NavigationPageWrapper } from '@workspace/ui/components/navigation-page-wrapper';

import { getQueryClient } from '@/lib/api/getQueryClient';
import { GetTrackedJobResponse } from './_modules/types';
import { Reaction } from '@workspace/ui/components/emoji-reaction/types';
import { MigrateTo } from '@workspace/ui/components/migrate-to/MigratoTo';
import { updateTrackedJob } from './_modules/api/mutations/updateTrackedJob';
import { getTrackedJobsOptions } from './_modules/api/queries/getTrackedJobs';
import { getJobRoleByIdOptions } from '../jobs/_modules/api/queries/getJobRoles';
import { industryTypes } from '@workspace/ui/components/pathways-tag/PathwaysTag';
import { createDownloadCompanyLogoUrl } from '../jobs/_modules/api/mutations/createDownloadCompanyLogoUrl';
import Loader from '@workspace/ui/components/loader/Loader';

const ImageWithFallback = ({
  fallback = null,
  alt,
  src
}: {
  fallback?: string | null;
  alt: string;
  src: string;
}) => {
  const [error, setError] = useState<boolean | null>(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return error ? null : (
    <Image
      alt={alt}
      src={src}
      width={32}
      height={32}
      className="rounded-full"
      onError={() => setError(true)}
    />
  );
};

export default function YourJobsPage(): ReactElement {
  const router = useRouter();
  const queryClient = getQueryClient();
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>('');
  const [newJobStages, setNewJobStages] = useState<JobStage[]>(
    JOB_STAGES.map(stage => stage)
  );

  const createDownloadCompanyLogoUrlMutation = useMutation({
    mutationFn: createDownloadCompanyLogoUrl,
    onError: error => console.log('error', error)
  });

  const updateTrackedJobMutation = useMutation({
    mutationFn: updateTrackedJob,
    onSuccess: data => refetch(),
    onError: (error: any) => console.error(error)
  });

  const {
    data: trackedJobs,
    isLoading: isTrackedJobsLoading,
    isError: isTrackedJobError,
    refetch
  } = useQuery(getTrackedJobsOptions);

  const [sortedJobs, setSortedJobs] = useState<{
    saved: Job[];
    applied: Job[];
    interview: Job[];
    offer: Job[];
    hired: Job[];
    'past-roles': Job[];
    ineligible: Job[];
  }>({
    saved: [],
    applied: [],
    interview: [],
    offer: [],
    hired: [],
    'past-roles': [],
    ineligible: []
  });

  const onLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login/existing-user';
  };

  const getLastCompletedStage = (stages: { [key: string]: boolean }) => {
    const completedStages = Object.entries(stages)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    return completedStages[
      completedStages.length - 1
    ].toLowerCase() as JobStage;
  };

  const getCompanyLogo = async (companyLogo: string) => {
    try {
      if (!companyLogo) return '';

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

  const transformTrackedJobs = (job: GetTrackedJobResponse) => {
    return {
      id: job.id,
      jobId: job.job_id,
      stages: job.stage,
      hired: job.stage?.Hired,
      title: job.job_info.title,
      is_favourite: job.is_favourite,
      reaction: job.reaction as Reaction,
      company: job.job_info.company_name,
      image: companyLogos[job.id] || '', // use presigned logo here
      lastEdited: new Date(job.updated_at).getTime(),
      stage: getLastCompletedStage(job.stage) as JobStage
    };
  };

  useEffect(() => {
    const hasIneligibleJobs = trackedJobs?.some(
      job => getLastCompletedStage(job.stage) === 'ineligible'
    );

    if (!hasIneligibleJobs) {
      setNewJobStages(prevStages =>
        prevStages.filter(stage => stage !== 'ineligible')
      );
    } else {
      setNewJobStages(prevStages =>
        prevStages.includes('ineligible')
          ? prevStages
          : [...prevStages, 'ineligible']
      );
    }
  }, [trackedJobs]);

  const [companyLogos, setCompanyLogos] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    if (!trackedJobs || Object.keys(companyLogos).length === 0) return;

    const fetchJobs = () => {
      const sortedJobs = {
        saved: trackedJobs
          .filter(job => getLastCompletedStage(job.stage) === 'saved')
          .map(job => transformTrackedJobs(job)),

        applied: trackedJobs
          .filter(job => getLastCompletedStage(job.stage) === 'applied')
          .map(job => transformTrackedJobs(job)),

        interview: trackedJobs
          .filter(job =>
            getLastCompletedStage(job.stage).startsWith('interview')
          )
          .map(job => transformTrackedJobs(job)),

        offer: trackedJobs
          .filter(job => getLastCompletedStage(job.stage) === 'offer')
          .map(job => transformTrackedJobs(job)),

        hired: trackedJobs
          .filter(job => getLastCompletedStage(job.stage) === 'hired')
          .map(job => transformTrackedJobs(job)),

        'past-roles': trackedJobs
          .filter(job => getLastCompletedStage(job.stage) === 'past-roles')
          .map(job => transformTrackedJobs(job)),

        ineligible: trackedJobs
          .filter(job => getLastCompletedStage(job.stage) === 'ineligible')
          .map(job => transformTrackedJobs(job))
      };

      setSortedJobs(sortedJobs);
    };

    fetchJobs();
  }, [trackedJobs, companyLogos]);

  useEffect(() => {
    (async () => {
      const logoUrl = await getCompanyLogo(
        trackedJobs?.find(job => job.stage?.hired)?.job_info.company_logo_url!
      );

      setCompanyLogoUrl(logoUrl);
    })();
  }, [trackedJobs?.find(job => job.stage?.hired)?.job_info.company_logo_url]);

  useEffect(() => {
    const fetchCompanyLogos = async () => {
      if (!trackedJobs) return;

      const logoPromises = trackedJobs.map(async job => {
        if (!job.job_info.company_logo_url) return { id: job.id, logoUrl: '' };
        const logoUrl = await getCompanyLogo(job.job_info.company_logo_url);
        return { id: job.id, logoUrl };
      });

      const logos = await Promise.all(logoPromises);

      const logosMap = logos.reduce(
        (acc, { id, logoUrl }) => {
          acc[id] = logoUrl;
          return acc;
        },
        {} as { [key: string]: string }
      );

      setCompanyLogos(logosMap);
    };

    fetchCompanyLogos();
  }, [trackedJobs]);

  const getFlatStages = (
    stages: { [key: string]: boolean },
    stage: JobStage
  ) => {
    const stageArr = Object.keys(stages!);

    const trueStages = stageArr.slice(0, stageArr.indexOf(stage) + 1);
    const newStages = stageArr.reduce(
      (acc, stage) => {
        acc[stage] = trueStages.includes(stage);
        return acc;
      },
      {} as Record<string, boolean>
    );

    return newStages;
  };

  const onUpdateTrackedJobStatus = (
    job: GetTrackedJobResponse,
    stage: JobStage,
    fronHiredDropdown: boolean = false
  ) => {
    const findHiredJob = trackedJobs?.find(
      job =>
        job.stage?.hired &&
        !job.stage?.['past-roles'] &&
        !job.stage?.['ineligible']
    );

    console.log('findHiredJob', findHiredJob);

    const newStagesOfCurrentJob = getFlatStages(job?.stage, stage);

    if (!findHiredJob) {
      updateTrackedJobMutation.mutate({
        job_id: job.job_id,
        stage: newStagesOfCurrentJob
      });

      return;
    }

    const newStagesOfHiredJob = getFlatStages(
      findHiredJob?.stage!,
      'past-roles'
    );

    console.log('newStagesOfCurrentJob', newStagesOfCurrentJob);
    console.log('newStagesOfHiredJob', newStagesOfHiredJob);

    updateTrackedJobMutation.mutate({
      job_id: job.job_id,
      stage: newStagesOfCurrentJob
    });

    const lastCompletedStageofCurrentJob = getLastCompletedStage(
      newStagesOfCurrentJob
    );

    if (
      newStagesOfCurrentJob?.hired &&
      !newStagesOfCurrentJob?.['past-roles']
    ) {
      updateTrackedJobMutation.mutate({
        job_id: findHiredJob?.job_id,
        stage: newStagesOfHiredJob
      });
    }
  };

  const onUpdateTrackedJobReaction = (jobId: string, reaction: Reaction) => {
    updateTrackedJobMutation.mutate({
      job_id: jobId,
      reaction: reaction
    });
  };

  const onUpdateIsFavourite = (job: Job, is_favourite: boolean) => {
    updateTrackedJobMutation.mutate({
      job_id: job.jobId,
      is_favourite: is_favourite
    });
  };

  if (isTrackedJobsLoading) return <Loader />;

  return (
    <NavigationPageWrapper
      onClickCustom={onLogout}
      items={navigationItems}
      profile={sessionStorage.getItem('profilePhoto')! || ''}
    >
      <div className="flex flex-col w-full">
        <div className="py-7 px-12 bg-white border-b-[2px] border-b-neutral-n-200">
          <Typography variant="heading-md">Your Jobs</Typography>
        </div>

        <div className="py-6 px-12 bg-white">
          <ProgressSteps
            saved={sortedJobs.saved.length}
            applied={sortedJobs.applied.length}
            interview={sortedJobs.interview.length}
            offer={sortedJobs.offer.length}
            accepted={sortedJobs.hired.length > 0}
          />
        </div>

        {trackedJobs
          ?.filter(
            job =>
              job.stage?.hired &&
              !job.stage?.['past-roles'] &&
              !job.stage?.['ineligible']
          )
          .sort((a, b) => {
            const dateA = new Date(a.updated_at).getTime();
            const dateB = new Date(b.updated_at).getTime();
            return dateB - dateA;
          })
          .map(job => {
            const id = job.id;
            const jobId = job.job_id;
            const jobTitle = job.job_info.title;
            const companyName = job.job_info.company_name;

            return (
              <div className="mx-12 mt-6 rounded-[16px] py-4 px-8 bg-[url(/images/gradient-mesh.png)] bg-cover bg-no-repeat bg-center bg-opacity-50">
                <div className="flex items-center">
                  <div
                    className="flex flex-col w-full py-6 cursor-pointer"
                    onClick={() =>
                      router.push(`/your-jobs/${id}?jobId=${jobId}`)
                    }
                  >
                    <Typography variant="heading-md" className="text-white">
                      {jobTitle}
                    </Typography>

                    <div className="flex items-center gap-3 mt-2">
                      {!!companyLogos[id] && (
                        <ImageWithFallback
                          fallback={null}
                          alt="Company Logo"
                          src={companyLogos[id]}
                        />
                      )}

                      <Typography variant="body" className="text-white">
                        {companyName}
                      </Typography>
                    </div>
                  </div>

                  <div className="w-[20%]">
                    <MigrateTo
                      jobId={jobId}
                      initialStage={'hired'}
                      dynamicJobStatuses={Object.keys(job.stage || {})}
                      onStatusChange={status =>
                        onUpdateTrackedJobStatus(job!, status as JobStage)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })
          .slice(0, 1)}

        <div className="flex flex-col gap-6 px-12 py-6 bg-neutral-n-100">
          {newJobStages
            .filter(stage => stage !== 'hired')
            .map((stage, index) => (
              <JobsTable
                key={stage}
                variant={stage}
                jobs={sortedJobs[stage] || []}
                onStatusChange={(element, status) =>
                  onUpdateTrackedJobStatus(
                    trackedJobs?.find(job => job.job_id === element.jobId)!,
                    status as JobStage
                  )
                }
                onFavoriteChange={(job, is_favourite) =>
                  onUpdateIsFavourite(job, is_favourite)
                }
                onReactionChange={(e, r) =>
                  onUpdateTrackedJobReaction(e.jobId, r)
                }
              />
            ))}
        </div>
      </div>
    </NavigationPageWrapper>
  );
}
