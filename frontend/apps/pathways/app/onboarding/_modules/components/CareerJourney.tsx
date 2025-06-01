'use client';

import { Form } from '@workspace/ui/components/form';
import { useForm, UseFormReturn } from 'react-hook-form';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Typography } from '@workspace/ui/components/typography';
import { Checkbox } from '@workspace/ui/components/forms/checkbox/Checkbox';
import { onBoardingSchemaStep2, type OnBoardingSchemaStep2 } from '../schema';

import {
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage
} from '@workspace/ui/components/form/Form';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from '@workspace/ui/components/forms/select/Select';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { updateUserProfile } from '../../../profile/_modules/common/api/mutations/update-profile';
import { User } from '@/app/profile/_modules/common/types';

const CareerJourney = () => {
  const router = useRouter();
  const queryClient = getQueryClient();
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>(
    'Please fill required fields.'
  );

  const user = queryClient.getQueryData(['user']) as User;

  const updateProfileMutation = useMutation({
    mutationFn: updateUserProfile,

    onError: error => {
      setHasErrors(true);
      setErrorMessage('Something went wrong. Please try again.');
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['user']
      });

      router.push('/onboarding?step=skills');
    }
  });

  const form = useForm<OnBoardingSchemaStep2>({
    resolver: zodResolver(onBoardingSchemaStep2),

    defaultValues: {
      interests: user?.interests || [],
      current_career: user?.current_career || '',
      job_search_phase: user?.job_search_phase || ''
    },

    mode: 'onSubmit'
  });

  useEffect(() => {
    type FieldErrorType = keyof typeof form.formState.errors;
    const subscription = form.watch((value, { name, type }) => {
      if (name && form.formState.errors[name as FieldErrorType]) {
        form.clearErrors(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (
    data: OnBoardingSchemaStep2,
    event?: BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    const isFormValid = await form.trigger();

    if (!isFormValid) {
      setHasErrors(true);
      return;
    }

    const { current_career, job_search_phase, interests } = data;
    const interestsArray = interests && interests?.length > 0 ? interests : [];

    updateProfileMutation.mutate({
      ...user,
      current_career,
      job_search_phase,
      interests: interestsArray
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {hasErrors && (
        <Alert
          variant="critical"
          label={errorMessage}
          onClose={() => setHasErrors(false)}
        />
      )}

      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={(event?: BaseSyntheticEvent) => event?.preventDefault()}
          noValidate
        >
          <FormField
            name="current_career"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-2">
                <FormLabel className={'text-black text-xs font-medium'}>
                  First off, where are you in your career?
                </FormLabel>

                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="flex flex-col">
                    <SelectItem value="Still studying">
                      Still studying
                    </SelectItem>
                    <SelectItem value="Just graduated">
                      Just graduated
                    </SelectItem>
                    <SelectItem value="Some experience (0-5 Years)">
                      Some experience (0-5 Years)
                    </SelectItem>
                    <SelectItem value="Working for a while now">
                      Working for a while now
                    </SelectItem>
                    <SelectItem value="Lots of experience (10+ Years)">
                      Lots of experience (10+ Years)
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="job_search_phase"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-2">
                <FormLabel className={'text-black text-xs font-medium'}>
                  What phase are you in your job search right now?
                </FormLabel>

                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="flex flex-col">
                    <SelectItem value="Passively open to new opportunities">
                      Passively open to new opportunities
                    </SelectItem>
                    <SelectItem value="Actively looking for a new job">
                      Actively looking for a new job
                    </SelectItem>
                    <SelectItem value="Looking to pivot my climate career">
                      Looking to pivot my climate career
                    </SelectItem>
                    <SelectItem value="Starting as a freelancer">
                      Starting as a freelancer
                    </SelectItem>
                    <SelectItem value="In an interview process">
                      In an interview process
                    </SelectItem>
                    <SelectItem value="Returning from a break">
                      Returning from a break
                    </SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <div id="jobTypePreference" className="flex flex-col gap-4">
            <Typography
              variant="caption"
              className={'text-black text-xs font-medium'}
            >
              {'What type of job are you interested in?'}
            </Typography>
            <div className="flex gap-x-8">
              <div className="w-1/2">
                <Checkbox
                  // index={1}
                  id="volunteering"
                  value="volunteering"
                  label="Volunteering"
                  nameCheckbox="interests"
                  // onChange={e => setCbVal(e.target.value, 'interests')}
                />
                <Checkbox
                  // index={3}
                  id="internships"
                  value="internships"
                  label="Internships"
                  nameCheckbox="interests"
                  // onChange={e => setCbVal(e.target.value, 'interests')}
                />
                <Checkbox
                  // index={5}
                  id="entry"
                  label="Entry"
                  value="entry"
                  nameCheckbox="interests"
                  // onChange={e => setCbVal(e.target.value, 'interests')}
                />
              </div>

              <div className="w-1/2">
                <Checkbox
                  // index={2}
                  id="intermediate"
                  label="Intermediate"
                  value="intermediate"
                  nameCheckbox="interests"
                  // onChange={e => setCbVal(e.target.value, 'interests')}
                />
                <Checkbox
                  // index={4}
                  id="senior"
                  label="Senior"
                  value="senior"
                  nameCheckbox="interests"
                  // onChange={e => setCbVal(e.target.value, 'interests')}
                />
                <Checkbox
                  // index={6}
                  id="executive"
                  label="Executive"
                  value="executive"
                  nameCheckbox="interests"
                  // onChange={e => setCbVal(e.target.value, 'interests')}
                />
              </div>
            </div>
          </div>
        </form>
      </Form>

      <div className="flex gap-4 mt-20">
        {/* <Button
          size="large"
          type="submit"
          label="Go Back"
          className="w-1/2"
          variant="secondary"
          onClick={() => router.push('/onboarding?step=profile')}
        /> */}
        <Button
          size="large"
          type="submit"
          variant="primary"
          label="Next Step"
          className="w-full"
          onClick={() => onSubmit(form.getValues())}
        />
      </div>
    </div>
  );
};

export default CareerJourney;
