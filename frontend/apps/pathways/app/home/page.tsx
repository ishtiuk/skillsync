'use client';
import Image from 'next/image';
import { Suspense } from 'react';
import { ReactElement, useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography } from '@workspace/ui/components/typography';
import { NavigationPageWrapper } from '@workspace/ui/components/navigation-page-wrapper';

import { Featured } from './_modules/components/Featured';
import ExploreSection from './_modules/components/Explore';
import { getHomeJobs } from '@/mocks/getMockJobs';
import { ProgressCards } from './_modules/components/ProgressCards';
import Loader from '@workspace/ui/components/loader/Loader';
import { Job, JobStage } from '@workspace/ui/components/jobs-table/types';
import { ProgressSteps } from '@workspace/ui/components/progress-steps/ProgressSteps';

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

import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import { getQueryClient } from '@/lib/api/getQueryClient';
import { navigationItems } from '@/lib/constants/navigationItems';
import { getTrackedJobsOptions } from '../your-jobs/_modules/api/queries/getTrackedJobs';
import { Reaction } from '@workspace/ui/components/emoji-reaction/types';
import { GetTrackedJobResponse } from '../your-jobs/_modules/types';
import { createDownloadCompanyLogoUrl } from '../jobs/_modules/api/mutations/createDownloadCompanyLogoUrl';
import useProfile from '@/hooks/useProfile';
import { industryTypes } from '@workspace/ui/components/pathways-tag/PathwaysTag';
import { getJobRolesOptions } from '../jobs/_modules/api/queries/getJobRoles';
import { GetJobRoleResponse } from '../jobs/_modules/types';
import { createTrackedJob } from '../your-jobs/_modules/api/mutations/createTrackedJob';
import { JobPostCard } from '@workspace/ui/components/job-post-card/JobPostCard';
import { logoutUser } from '../login/_modules/common/api/mutations/logout';

export default function HomePage(): ReactElement {
  return (
    <Suspense fallback={<Loader />}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOnboarding = searchParams.get('onboarding');
  const [trackedJobCompanyLogos, setTrackedJobCompanyLogos] = useState<{
    [key: string]: string;
  }>({});

  const [companyLogos, setCompanyLogos] = useState<{ [key: string]: string }>(
    {}
  );

  const [openWelcomeDialog, setOpenWelcomeDialog] = useState(false);

  const queryClient = getQueryClient();

  const { userData, isLoading } = useProfile();

  const { data: trackedJobs, isLoading: isTrackedJobsLoading } = useQuery(
    getTrackedJobsOptions
  );

  const {
    data: roles,
    isLoading: isJobRolesLoading,
    isRefetching
  } = useQuery({
    ...getJobRolesOptions,
    queryKey: ['jobRole', {}, '5000']
  });

  const createTrackedJobMutation = useMutation({
    mutationFn: createTrackedJob,
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobRole'] });
      queryClient.invalidateQueries({ queryKey: ['trackedJobs'] });
    }
  });

  const createDownloadCompanyLogoUrlMutation = useMutation({
    mutationFn: createDownloadCompanyLogoUrl,
    onError: error => console.log('error', error)
  });

  const mutation = useMutation({
    mutationFn: logoutUser,
    onError: error => console.error(error),
    onSuccess: () => (window.location.href = '/login/existing-user')
  });

  //   const jobs = getHomeJobs();

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
      title: job.job_info.title,
      is_favourite: job.is_favourite,
      hired: job.stage?.Hired || false,
      reaction: job.reaction as Reaction,
      company: job.job_info.company_name,
      image: trackedJobCompanyLogos[job.id] || '',
      lastEdited: new Date(job.updated_at).getTime(),
      stage: getLastCompletedStage(job.stage) as JobStage,
      industry: job.job_info.pathway as keyof typeof industryTypes
    };
  };

  const transformJobs = (job: GetJobRoleResponse) => {
    return {
      jobId: job.id,
      title: job.title,
      company: job.company_name,
      stage: 'saved' as JobStage,
      image: job.company_logo_url,
      lastEdited: new Date(job.created_at).getTime(),
      industry: job.pathway as keyof typeof industryTypes
    };
  };

  const onLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login/existing-user';
  };

  useEffect(() => {
    if (userData?.first_name && isOnboarding === 'true') {
      setOpenWelcomeDialog(true);
    }
  }, [userData]);

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
    const fetchCompanyLogos = async () => {
      if (!trackedJobs) return;

      const logoPromises = trackedJobs.map(async job => {
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

      setTrackedJobCompanyLogos(logosMap);
    };

    fetchCompanyLogos();
  }, [trackedJobs]);

  useEffect(() => {
    const fetchCompanyLogos = async () => {
      if (!roles) return;

      const logoPromises = roles.map(async r => {
        if (!r.company_logo_url) return { id: r.id, logoUrl: '' };
        const logoUrl = await getCompanyLogo(r.company_logo_url);
        return { id: r.id, logoUrl };
      });

      const logos = await Promise.all(logoPromises);
      setCompanyLogos(
        logos.reduce((acc, { id, logoUrl }) => ({ ...acc, [id]: logoUrl }), {})
      );
    };

    fetchCompanyLogos();
  }, [roles]);

  const checkIfJobIsInAnyStages = (job: GetJobRoleResponse) => {
    return Object.values(job.stage).some(stage => stage);
  };

  const onTrackJob = async (jobId: string) => {
    const isInAnyJobStages = checkIfJobIsInAnyStages(
      roles?.find(r => r.id === jobId) as GetJobRoleResponse
    );

    let stages = {};

    if (isInAnyJobStages) {
      stages = {
        saved: false,
        offer: false,
        hired: false,
        applied: false,
        ineligible: false,
        'past-roles': false,
        'interview-1': false
      };
    } else {
      stages = {
        saved: true,
        offer: false,
        hired: false,
        applied: false,
        ineligible: false,
        'past-roles': false,
        'interview-1': false
      };
    }

    createTrackedJobMutation.mutate({
      notes: '',
      activity: '',
      stage: stages,
      reaction: 'nervous',
      is_favourite: false,
      job_id: jobId ?? ''
    });
  };

  if (isLoading || isTrackedJobsLoading) return <Loader />;

  console.log(trackedJobs);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavigationPageWrapper
        onClickCustom={onLogout}
        items={navigationItems}
        profile={sessionStorage.getItem('profilePhoto') || ''}
      >
        <div className="flex flex-col w-full max-w-full shrink">
          <div className="w-full flex justify-between align-center px-12 py-[29px] border-b-2 border-b-neutral-n-300 bg-white">
            <Typography variant="heading-md">
              Welcome back, {userData?.first_name}!
            </Typography>
          </div>
          <div className="px-12 py-6 flex flex-col gap-6 bg-white">
            <div className="flex justify-between flex-row w-full">
              <Typography variant="heading-sm">Your Job Tracker</Typography>
              <Button
                label="View Your Jobs"
                variant="secondary"
                size="default"
                onClick={() => router.push('/your-jobs')}
                rightIcon="ArrowCircleRight_fill"
              />
            </div>
            <ProgressSteps
              saved={sortedJobs.saved.length}
              applied={sortedJobs.applied.length}
              interview={sortedJobs.interview.length}
              offer={sortedJobs.offer.length}
              accepted={sortedJobs.hired.length > 0}
            />
          </div>

          <ProgressCards
            jobs={Object.values(sortedJobs).flatMap(jobList =>
              jobList.map(job => job)
            )}
          />

          <ExploreSection
            jobs={roles?.map(role => transformJobs(role) as Job) || []}
          />

          {/* <Featured jobs={roles ?? []} /> */}

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
              {roles
                ?.map(job => {
                  return (
                    <JobPostCard
                      badge={'featured'}
                      jobPostId={job.id}
                      key={`job-${job.id}`}
                      jobPostName={job.title}
                      cardVariant="medium-flex"
                      companyName={job.company_name}
                      className="col-span-1 row-span-1"
                      onSave={() => onTrackJob(job.id)}
                      saved={checkIfJobIsInAnyStages(job)}
                      companyLogo={companyLogos[job.id] || ''}
                      workplace={job.workplace_type.toLowerCase() as any}
                      pathway={
                        job.pathway.toLowerCase().replace(' ', '-') as any
                      }
                      isSaving={
                        createTrackedJobMutation.isPending || isRefetching
                      }
                      jobType={
                        job.position_type.toLowerCase().replace('-', '_') as any
                      }
                    />
                  );
                })
                .slice(0, 9)}
            </div>
          </div>
        </div>

        <Dialog open={openWelcomeDialog} onOpenChange={setOpenWelcomeDialog}>
          <DialogContent className="sm:max-w-[520px] p-0">
            <DialogHeader>
              <div className="flex justify-center w-[98%] bg-[#FAF9F7] rounded-[24px]">
                <Image
                  width={380}
                  height={100}
                  alt="Welcome to Pathways"
                  src="/images/welcome-image.svg"
                  className="object-cover object-center"
                />
              </div>
              <div className="p-8">
                <DialogTitle>
                  <Typography
                    variant="heading-md"
                    className="text-primary-g-900 mb-2"
                  >
                    Hi, {userData?.first_name}! Welcome to Pathways!
                  </Typography>
                </DialogTitle>

                <DialogDescription>
                  <Typography variant="body" className="text-primary-g-900">
                    Pathways is your tool to help you discover climate spaces,
                    track your job progression, and grow your climate knowledge.
                  </Typography>
                </DialogDescription>
              </div>
            </DialogHeader>

            <DialogFooter className="sm:justify-center px-6 pb-6">
              <Button
                size="large"
                type="button"
                variant="primary"
                label="Finish Profile Setup"
                onClick={() => router.push('/profile')}
              />

              <DialogClose asChild>
                <Button
                  type="button"
                  size="large"
                  variant="tertiary"
                  label="Begin Exploring Pathways"
                />
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </NavigationPageWrapper>
    </HydrationBoundary>
  );
}
