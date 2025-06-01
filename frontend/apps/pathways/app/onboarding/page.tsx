'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Typography } from '@workspace/ui/components/typography';

import Goals from './_modules/components/Goals';
import Skills from './_modules/components/Skills';
import { getQueryClient } from '@/lib/api/getQueryClient';
import Loader from '@workspace/ui/components/loader/Loader';
import OnBoardingStep1 from './_modules/components/Profile';
import OnBoardingStep2 from './_modules/components/CareerJourney';

import { useQuery, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import Experiences from './_modules/components/Experiences';
import { getUserOptions } from '../profile/_modules/common/api/queries/get-user';

const steps = [
  {
    step: 1,
    slug: 'profile',
    title: 'Build your profile',
    component: <OnBoardingStep1 />
  },
  {
    step: 2,
    slug: 'career-journey',
    title: 'Your Career Journey',
    component: <OnBoardingStep2 />
  },

  {
    step: 3,
    slug: 'skills',
    title: 'Add your skills',
    component: <Skills />
  },

  {
    step: 4,
    slug: 'goals',
    title: 'Write your goals',
    component: <Goals />
  },
  {
    step: 5,
    slug: 'experiences',
    title: 'Last thing, want to add your work experience?',
    component: <Experiences />
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = getQueryClient();
  const searchParams = useSearchParams();
  const { data: userData, isLoading } = useQuery(getUserOptions);

  const currentStep = searchParams.get('step') as
    | 'profile'
    | 'career-journey'
    | 'skills'
    | 'goals'
    | 'experiences';

  useEffect(() => {
    const isSearchStep = steps.some(step => step.slug === currentStep);
    if (!isSearchStep) router.push('/onboarding?step=profile');
  }, [currentStep]);

  if (isLoading) return <Loader />;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex-1 flex flex-col w-full justify-center gap-6">
        {currentStep !== 'goals' && (
          <div className="flex flex-col gap-2">
            <Typography variant="heading-md">
              {steps.find(step => step.slug === currentStep)?.title ||
                'Welcome!'}
            </Typography>

            {currentStep !== 'experiences' && (
              <Typography variant="caption" className="text-neutral-n-700">
                Hey 👋 {userData?.first_name} {userData?.last_name}, lets build
                a profile that's tailored just for you, creating a more
                personalized pathways experience that will help you grow and
                succeed.
              </Typography>
            )}
          </div>
        )}

        <div>
          {steps.find(step => step.slug === currentStep)?.component ||
            steps[0].component}
        </div>
      </div>
    </HydrationBoundary>
  );
}
