'use client';

import React, { ReactElement } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Tag } from '@workspace/ui/components/tag';
import HtmlRenderer from '@/components/HTMLRenderer';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { navigationItems } from '@/lib/constants/navigationItems';
import { Button } from '@workspace/ui/components/button';
import { PhosphorIcon } from '@workspace/ui/icons/PhosphorIcon';
import { Typography } from '@workspace/ui/components/typography';
import { Badge } from '@workspace/ui/components/badges/badge/Badge';
import { getJobRoleByIdOptions } from '../_modules/api/queries/getJobRoles';
import { SavedButton } from '@workspace/ui/components/save-button/SaveButton';

import {
  industryTypes,
  PathwayTag
} from '@workspace/ui/components/pathways-tag/PathwaysTag';
import { NavigationPageWrapper } from '@workspace/ui/components/navigation-page-wrapper';

import {
  industryTypeLabelMap,
  JobCategory,
  JobCategoryTag
} from '@workspace/ui/components/job-category-tag/JobCategoryTag';
import { createTrackedJob } from '@/app/your-jobs/_modules/api/mutations/createTrackedJob';
import { getTrackedJobByIdOptions } from '@/app/your-jobs/_modules/api/queries/getTrackedJobs';
import Loader from '@workspace/ui/components/loader/Loader';

export default function JobDetailsPage(): ReactElement {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = getQueryClient();

  const hasSalary = (min: number | null, max: number | null) => {
    if (min === null && max === null) {
      return 'Negotiable';
    }

    if (min === undefined && max === undefined) {
      return 'Negotiable';
    }

    if (min === null && max !== null) {
      return `$${max?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ', ')}`;
    }

    if (max === null && min !== null) {
      return `$${min?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ', ')}`;
    }

    if (min === max) {
      return `$${min?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ', ')}`;
    }

    return `$${min
      ?.toString()
      ?.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      )} - $${max?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  const hasEducation = (education: string | null) => {
    if (!!!education) {
      return 'Not Specified';
    }

    return `${education} preferred`;
  };

  const createTrackedJobMutation = useMutation({
    mutationFn: createTrackedJob,
    onSuccess: () => (window.location.href = '/your-jobs'),
    onError: (error: any) => console.error(error)
  });

  const { data, isLoading, isError } = useQuery({
    ...getJobRoleByIdOptions,
    queryKey: ['jobRole', pathname.split('/')[2] ?? ''],
    enabled: !!pathname.split('/')[2]
  });

  const {
    data: trackedJobData,
    isLoading: isTrackedJobLoading,
    isError: isTrackedJobError,
    refetch
  } = useQuery({
    ...getTrackedJobByIdOptions,
    queryKey: ['trackedJobId', data?.id!],
    enabled: !!data?.id,
    retry: false
  });

  const onLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login/existing-user';
  };

  const isJobClosingSoon = (date: string | Date) => {
    const isClosingSoon =
      new Date(date).getTime() - new Date().getTime() <
        7 * 24 * 60 * 60 * 1000 &&
      new Date(date).getTime() - new Date().getTime() > 0;

    return isClosingSoon;
  };

  if (isLoading) return <Loader />;

  return (
    <NavigationPageWrapper
      onClickCustom={onLogout}
      items={navigationItems}
      profile={sessionStorage.getItem('profilePhoto') || ''}
    >
      <div className="flex flex-col w-full items-start flex-1 basis-0 bg-neutral-50">
        <div className="flex justify-between w-full px-12 py-6 items-center gap-2 border-b border-b-neutral-n-300 bg-neutral-50">
          <div className="flex flex-col items-start gap-3 flex-1">
            <div className="flex items-center gap-3">
              <PathwayTag
                variant={
                  data?.pathway
                    ?.toLowerCase()
                    .replace(' ', '-') as keyof typeof industryTypes
                }
              />

              {Object.keys(industryTypeLabelMap).includes(
                data?.job_category!
              ) && (
                <JobCategoryTag
                  variant={data?.job_category?.toLowerCase() as JobCategory}
                />
              )}

              {data?.is_bipoc_owned && (
                <Badge text="BIPOC Owned" variant="BIPOCOwned" />
              )}
            </div>
            <div>
              <Typography variant="heading-sm">{data?.title}</Typography>
              <Typography variant="body">{data?.company_name}</Typography>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              size="large"
              label="Apply Now"
              variant="primary"
              leftIcon="ArrowSquareOut_regular"
              onClick={() => window.open(data?.external_link, '_blank')}
            />
            <SavedButton
              saved={trackedJobData?.stage.saved ?? false}
              size="large"
              onSave={() => {
                createTrackedJobMutation.mutate({
                  stage: {
                    saved: true,
                    applied: false,
                    'interview-1': false,
                    offer: false,
                    hired: false,
                    'past-roles': false,
                    ineligible: false
                  },
                  notes: '',
                  activity: '',
                  reaction: 'nervous',
                  is_favourite: false,
                  job_id: data?.id ?? ''
                });
              }}
            />
          </div>
        </div>
        <div className="flex w-full py-6 px-12 items-start gap-6 bg-neutral-n-100">
          <div className="flex p-6 items-start gap-3 basis-2/3 border border-solid rounded-2xl bg-white">
            <div className="flex flex-col items-start gap-6 flex-1 basis-0">
              <div className="flex flex-col items-start gap-3 self-stretch">
                <Typography variant="heading-sm">Role Description</Typography>
                <HtmlRenderer html={data?.role_description!} />
              </div>

              {data?.primary_responsibilities && (
                <div className="flex flex-col items-start gap-3 self-stretch">
                  <Typography variant="heading-sm">
                    Primary Responsibilities
                  </Typography>
                  <HtmlRenderer html={data?.primary_responsibilities!} />
                </div>
              )}

              {data?.required_qualifications && (
                <div className="flex flex-col items-start gap-3 self-stretch">
                  <Typography variant="heading-sm">
                    Required Qualifications
                  </Typography>
                  <HtmlRenderer html={data?.required_qualifications!} />
                </div>
              )}

              {data?.desired_qualifications && (
                <div className="flex flex-col items-start gap-3 self-stretch">
                  <Typography variant="heading-sm">
                    Desired Qualifications
                  </Typography>
                  <HtmlRenderer html={data?.desired_qualifications!} />
                </div>
              )}

              {data?.special_educational_requirements && (
                <div className="flex flex-col items-start gap-3 self-stretch">
                  <Typography variant="heading-sm">
                    Special Education Requirements
                  </Typography>
                  <HtmlRenderer
                    html={data?.special_educational_requirements!}
                  />
                </div>
              )}

              {data?.compensation_benefits && (
                <div className="flex flex-col items-start gap-3 self-stretch">
                  <Typography variant="heading-sm">
                    Compensation and Benefits
                  </Typography>
                  <HtmlRenderer html={data?.compensation_benefits!} />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start gap-6 basis-1/3">
            {trackedJobData && (
              <Button
                className="w-full"
                variant="secondary"
                label="View Your Notes"
                onClick={() =>
                  router.push(
                    `/your-jobs/${trackedJobData?.id}?jobId=${trackedJobData?.job_id}`
                  )
                }
              />
            )}

            <div className="flex py-4 px-6 w-full justify-between items-center self-stretch rounded-2xl border border-solid bg-white">
              <div className="flex items-center gap-1">
                <Typography variant="caption-strong">Apply Before:</Typography>
                <Tag
                  label={new Date(
                    data?.closing_date ?? new Date()
                  )?.toLocaleDateString()}
                ></Tag>
              </div>
              {isJobClosingSoon(data?.closing_date ?? new Date()) && (
                <Badge minimaze text={'Closing Soon'} variant={'warning'} />
              )}
            </div>
            <div className="flex flex-col items-start self-stretch border rounded-2xl bg-white">
              <div className="flex py-4 px-6 items-center gap-2 self-stretch">
                <div className="flex items-center gap-2">
                  <PhosphorIcon
                    iconVariant="Briefcase_fill"
                    className="fill-neutral-n-500"
                  />
                  <Typography variant="body-strong">Overview</Typography>
                </div>
              </div>
              <div className="flex flex-col py-4 px-6 items-start gap-6 self-stretch ">
                <div className="flex flex-col items-start gap-2 self-stretch">
                  <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                    <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                      <Typography variant="caption">Salary</Typography>
                    </div>
                    <Tag
                      label={hasSalary(
                        data?.minimum_pay ?? null,
                        data?.maximum_pay ?? null
                      )}
                    />
                  </div>
                  <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                    <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                      <Typography variant="caption">Education</Typography>
                    </div>
                    <Tag label={hasEducation(data?.education_level ?? '')} />
                  </div>
                  <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                    <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                      <Typography variant="caption">Level</Typography>
                    </div>
                    <Tag label={data?.level_of_experience}></Tag>
                  </div>
                  <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                    <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                      <Typography variant="caption">Location</Typography>
                    </div>
                    <div className="flex gap-2">
                      <Tag label={data?.city}></Tag>
                      <Tag label={data?.state}></Tag>
                    </div>
                  </div>
                  <div className="flex justify-between w-full pb-3 border-b border-neutral-n-100">
                    <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                      <Typography variant="caption">Workplace</Typography>
                    </div>
                    <Tag label={data?.workplace_type}></Tag>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="default"
                    label="Apply Now"
                    variant="primary"
                    leftIcon="ArrowSquareOut_regular"
                    onClick={() => window.open(data?.external_link, '_blank')}
                  />
                  <SavedButton
                    size="default"
                    saved={trackedJobData?.stage.saved ?? false}
                    onSave={() => {
                      createTrackedJobMutation.mutate({
                        stage: {
                          saved: true,
                          applied: false,
                          'interview-1': false,
                          offer: false,
                          hired: false,
                          'past-roles': false,
                          ineligible: false
                        },
                        notes: '',
                        activity: '',
                        reaction: 'nervous',
                        is_favourite: false,
                        job_id: data?.id ?? ''
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavigationPageWrapper>
  );
}
