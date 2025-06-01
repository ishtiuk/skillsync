'use client';

import { useForm } from 'react-hook-form';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Form, TextInput } from '@workspace/ui/components/form';

import { US_STATES } from '@/lib/constants/locations';
import { onBoardingSchemaStep1, OnBoardingSchemaStep1 } from '../schema';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger
} from '@workspace/ui/components/forms/select/Select';

import {
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage
} from '@workspace/ui/components/form/Form';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { Button } from '@workspace/ui/components/button';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { updateUserProfile } from '../../../profile/_modules/common/api/mutations/update-profile';
import { User } from '@/app/profile/_modules/common/types';

const Profile = () => {
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

      router.push('/onboarding?step=career-journey');
    }
  });

  const form = useForm<OnBoardingSchemaStep1>({
    resolver: zodResolver(onBoardingSchemaStep1),

    defaultValues: {
      city: user?.city || '',
      state: user?.state || '',
      gender: user?.gender || '',
      phone_number: user?.phone_number || '',
      ethnic_background: user?.ethnicity || ''
    },

    mode: 'onSubmit'
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name && form.formState.errors[name]) {
        form.clearErrors(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (
    data: OnBoardingSchemaStep1,
    event?: BaseSyntheticEvent
  ) => {
    event?.preventDefault();
    const isFormValid = await form.trigger();

    if (!isFormValid) {
      setHasErrors(true);
      return;
    }

    updateProfileMutation.mutate({
      ...user,
      city: data?.city!,
      state: data?.state!,
      gender: data?.gender!,
      country: 'United States',
      ethnicity: data?.ethnic_background!
    });

    setHasErrors(false);
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
            name="gender"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-2">
                <FormLabel className={'text-black text-xs font-medium'}>
                  What are your pronouns?
                </FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pronoun" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="he">He/Him</SelectItem>
                    <SelectItem value="she">She/Her</SelectItem>
                    <SelectItem value="they">They/Them</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="n/a">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="ethnic_background"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col w-full gap-2">
                <FormLabel className={'text-black text-xs font-medium'}>
                  What’s your ethnicity
                </FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your ethnicity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="asian">
                      Asian or Pacific Islander
                    </SelectItem>
                    <SelectItem value="black">
                      Black or African American
                    </SelectItem>
                    <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                    <SelectItem value="native">
                      Native American or Alaskan Native
                    </SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <TextInput
            type="text"
            fieldName="phone_number"
            placeholder="Phone Number"
          />

          <div id="residencyInfo" className="flex flex-col gap-4">
            <TextInput
              noSuffix
              name="city"
              type="text"
              fieldName="city"
              placeholder="Your Location"
              autoComplete="address-level2"
            />

            <FormField
              name="state"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col w-full gap-2">
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="flex flex-col">
                      {Array.from(US_STATES).map(state => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>

      <Button
        size="large"
        type="submit"
        variant="primary"
        label="Next Step"
        className="w-full mt-20"
        onClick={() => onSubmit(form.getValues())}
      />
    </div>
  );
};

export default Profile;
