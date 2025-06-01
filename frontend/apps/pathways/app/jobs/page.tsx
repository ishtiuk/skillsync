'use client';

import { getQueryClient } from '@/lib/api/getQueryClient';
import { navigationItems } from '@/lib/constants/navigationItems';
import { Button } from '@workspace/ui/components/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography } from '@workspace/ui/components/typography';
import { getJobRolesOptions } from './_modules/api/queries/getJobRoles';

import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import { JobPostCard } from '@workspace/ui/components/job-post-card/JobPostCard';
import { NavigationPageWrapper } from '@workspace/ui/components/navigation-page-wrapper';
import { FilterPillNew as FilterPill } from '@workspace/ui/components/filter-pill-new/FilterPillNew';

import {
  jobTypeFilters,
  pathwayFilters,
  datePostedFilters,
  salaryRangeFilters,
  workplaceTypeFilters,
  experienceLevelFilters
} from '@/lib/constants/filters';

import { US_STATES } from '@/lib/constants/locations';

import { Suspense, useEffect, useState } from 'react';
import { GetJobRoleResponse } from './_modules/types';
import Loader from '@workspace/ui/components/loader/Loader';
import SearchBar from '@workspace/ui/components/search-bar/SearchBar';
import { createTrackedJob } from '../your-jobs/_modules/api/mutations/createTrackedJob';
import { industryTypeLabelMap } from '@workspace/ui/components/pathways-tag/PathwaysTag';
import { createDownloadCompanyLogoUrl } from './_modules/api/mutations/createDownloadCompanyLogoUrl';

type FilterData = {
  id: string;
  label: string;
  checked?: boolean;
  nameFilter: string;
};

type QueryType = string | undefined;

type LogoType = { [key: string]: string };

export default function JobsPage() {
  return (
    <Suspense fallback={<Loader />}>
      <JobsPageContent />
    </Suspense>
  );
}

function JobsPageContent() {
  const router = useRouter();
  const queryClient = getQueryClient();
  const searchParams = useSearchParams();

  const createTrackedJobMutation = useMutation({
    mutationFn: createTrackedJob,
    onError: error => console.error(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobRole'] });
      queryClient.invalidateQueries({ queryKey: ['trackedJobs'] });
    }
  });

  const search = searchParams.get(
    'pathway'
  ) as keyof typeof industryTypeLabelMap;

  useEffect(() => {
    if (search && search in industryTypeLabelMap) {
      setPathway(
        pathway.map(item => {
          return {
            ...item,
            checked: item.label === industryTypeLabelMap[search]
          };
        })
      );
    }
  }, [search]);

  const createDownloadCompanyLogoUrlMutation = useMutation({
    mutationFn: createDownloadCompanyLogoUrl,
    onError: error => console.log('error', error)
  });

  const [city, setCity] = useState<QueryType>(undefined);
  const [state, setState] = useState<QueryType>(undefined);
  const [searchQuery, setSearchQuery] = useState<QueryType>(undefined);

  const [companyLogos, setCompanyLogos] = useState<LogoType>({});
  const [pathway, setPathway] = useState<FilterData[]>(pathwayFilters);
  const [datePosted, setDatePosted] = useState<FilterData[]>(datePostedFilters);

  const [savedRoles, setSavedRoles] = useState<GetJobRoleResponse[]>([]);

  const [expLevel, setExpLevel] = useState<FilterData[]>(
    experienceLevelFilters
  );

  const [salaryRange, setSalaryRange] =
    useState<FilterData[]>(salaryRangeFilters);

  const [positionType, setPositionType] =
    useState<FilterData[]>(jobTypeFilters);

  const [workplaceType, setWorkplaceType] =
    useState<FilterData[]>(workplaceTypeFilters);

  const [isBIPOCOwned, setIsBIPOCOwned] = useState<boolean | undefined>(
    undefined
  );

  const convertRangeToNumber = (range: string, bound: 'min' | 'max') => {
    console.log('range', range);

    if (range === '' || range === undefined) return undefined;
    const [min, max] = range
      .replaceAll('k', '')
      .replaceAll('$', '')
      .split('-')
      .map(Number);

    return bound === 'min' ? min * 1000 : max * 1000;
  };

  const getFilteredList = (list: FilterData[]) => {
    const isAllUnchecked = list.every(item => !item.checked);
    return isAllUnchecked
      ? list.map(item => item.label)
      : list.filter(item => item.checked).map(item => item.label);
  };

  const getSalaryRange = (
    rangeList: FilterData[],
    bound: 'min' | 'max'
  ): number[] => {
    const isAllUnchecked = rangeList.every(item => !item.checked);

    return isAllUnchecked
      ? []
      : rangeList
          .filter(item => item.checked)
          .map(item => convertRangeToNumber(item.label, bound))
          .filter((item): item is number => item !== undefined);
  };

  const {
    data: roles,
    isRefetching,
    isLoading,
    refetch
  } = useQuery({
    ...getJobRolesOptions,
    queryKey: [
      'jobRole',
      {
        is_bipoc_owned: isBIPOCOwned,
        pathway: getFilteredList(pathway),
        city: city === '' ? undefined : city,
        state: state === '' ? undefined : state,
        position_type: getFilteredList(positionType),
        level_of_experience: getFilteredList(expLevel),
        workplace_type: getFilteredList(workplaceType),
        minimum_pay: getSalaryRange(salaryRange, 'min'),
        maximum_pay: getSalaryRange(salaryRange, 'max'),
        title: searchQuery === '' ? undefined : searchQuery
      },
      '5000'
    ]
  });

  useEffect(() => {
    if (roles) {
      setSavedRoles(roles);
    }
  }, [roles]);

  const parseLocationInput = (input: string | undefined) => {
    if (!input) return { city: undefined, state: undefined };

    const trimmedInput = input.trim();

    if (US_STATES.has(trimmedInput)) {
      return { city: undefined, state: trimmedInput };
    }

    return { city: trimmedInput, state: undefined };
  };

  const onLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login/existing-user';
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

  useEffect(() => {
    refetch();
  }, [
    pathway,
    expLevel,
    salaryRange,
    positionType,
    isBIPOCOwned,
    workplaceType
  ]);

  useEffect(() => {
    const getSelectedSearchDate = datePosted.find(
      item => item.checked === true
    );

    if (!getSelectedSearchDate) {
      setSavedRoles(roles!);
      return;
    }

    const [_, value, unit] = getSelectedSearchDate.id.split('-');
    if (!value || !unit) return;

    const now = new Date();
    const thresholdDate = new Date();

    switch (unit) {
      case 'hours':
        thresholdDate.setHours(now.getHours() - parseInt(value));
        break;
      case 'days':
        thresholdDate.setDate(now.getDate() - parseInt(value));
        break;
      default:
        return;
    }

    const filtered = roles?.filter(role => {
      const createdAt = new Date(role.created_at);
      return createdAt >= thresholdDate;
    });

    setSavedRoles(filtered!);
  }, [datePosted, roles]);

  const checkBIPOCStatus = () => {
    setIsBIPOCOwned(isBIPOCOwned === undefined ? true : undefined);
  };

  const onTrackJob = (jobId: string) => {
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
      job_id: jobId ?? '',
      reaction: 'nervous',
      is_favourite: false
    });
  };

  const checkIfJobIsInAnyStages = (job: GetJobRoleResponse) => {
    return Object.values(job.stage).some(stage => stage);
  };

  //   if (isLoading) return <Loader />;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavigationPageWrapper
        onClickCustom={onLogout}
        items={navigationItems}
        profile={sessionStorage.getItem('profilePhoto') || ''}
      >
        <div>
          <div className="bg-white flex px-12 py-6 items-center gap-6 self-stretch border-b-2 border-b-neutral-n-200">
            {/*need to add border styling*/}
            <SearchBar
              onSubmit={values => {
                const { city: pCity, state: pState } = parseLocationInput(
                  values.location
                );

                setCity(pCity);
                setState(pState);
                setSearchQuery(values.search);
                refetch();
              }}
            />
          </div>

          <div className="flex gap-4 px-12 py-[29px] bg-white border-b-2 border-b-neutral-n-300 relative z-[20] items-stretch">
            <div
              onClick={checkBIPOCStatus}
              className={`transition-colors duration-200 ease-in-out max-h-[41px] inline-flex items-center bg-neutral-n-200 rounded-[6px] px-4 text-sm font-bold cursor-pointer ${
                isBIPOCOwned
                  ? 'bg-primary-g-700 text-primary-g-100 hover:bg-primary-g-800 hover:text-primary-g-100'
                  : ''
              }`}
            >
              BIPOC Owned
            </div>

            <FilterPill
              type="radio"
              label="Date Posted"
              setData={setDatePosted}
              data={datePostedFilters}
            />

            <FilterPill
              type="checkbox"
              data={workplaceType}
              label="Workplace Type"
              setData={setWorkplaceType}
            />

            <FilterPill
              type="checkbox"
              data={expLevel}
              setData={setExpLevel}
              label="Experience Level"
            />

            <FilterPill
              label="Pathway"
              type="checkbox"
              data={pathway}
              setData={setPathway}
              //defaultValue={pathway}
            />

            <FilterPill
              type="checkbox"
              label="Job Type"
              data={positionType}
              setData={setPositionType}
            />

            <FilterPill
              type="checkbox"
              data={salaryRange}
              label="Salary Range"
              setData={setSalaryRange}
            />
          </div>

          {isLoading ? (
            <Loader className="h-[70vh]" />
          ) : (
            <div className="p-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 w-full justify-between gap-3 pt-9">
              {savedRoles && savedRoles.length > 0 ? (
                savedRoles?.map(r => {
                  return (
                    <JobPostCard
                      jobPostId={r.id}
                      key={`job-${r.id}`}
                      jobPostName={r.title}
                      cardVariant="medium-flex"
                      companyName={r.company_name}
                      onSave={() => onTrackJob(r.id)}
                      className="col-span-1 row-span-1"
                      saved={checkIfJobIsInAnyStages(r)}
                      companyLogo={companyLogos[r.id] || ''}
                      isSaving={
                        createTrackedJobMutation.isPending || isRefetching
                      }
                      badge={r.is_bipoc_owned ? 'bipoc' : undefined}
                      workplace={r.workplace_type.toLowerCase() as any}
                      pathway={r.pathway.toLowerCase().replace(' ', '-') as any}
                      jobType={
                        r.position_type.toLowerCase().replace('-', '_') as any
                      }
                    />
                  );
                })
              ) : (
                <div className="col-span-3 flex items-center justify-center w-full h-[300px]">
                  <Typography variant="body" className="text-neutral-n-800">
                    No jobs found
                  </Typography>
                </div>
              )}
            </div>
          )}
        </div>
      </NavigationPageWrapper>
    </HydrationBoundary>
  );
}
