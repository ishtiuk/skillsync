import { Button } from '@workspace/ui/components/button';
import React, { BaseSyntheticEvent, useState } from 'react';

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger
} from '@workspace/ui/components/dialog/Dialog';

import { useForm } from 'react-hook-form';
import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';
import { Typography } from '@workspace/ui/components/typography';
import { TextInput, Dropdown, Form } from '@workspace/ui/components/form';

import {
  contactInfoSchema,
  ContactInfoSchema
} from '../schemas/ContactInfoSchema';

import { getQueryClient } from '@/lib/api/getQueryClient';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@workspace/ui/components/alert/Alert';

import { updateUserProfile } from '@/app/profile/_modules/common/api/mutations/update-profile';
import { US_STATES } from '@/lib/constants/locations';
import { getUserOptions } from '../api/queries/get-user';

const ContactInfoForm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [hasErrors, setHasErrors] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onError: error => setHasErrors(true),
    onSuccess: () => {
      setTimeout(() => {
        setOpen(false);
      }, 100);

      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  const queryClient = getQueryClient();

  const { data: userData, isLoading: isUserProfileLoading } =
    useQuery(getUserOptions);

  const form = useForm<ContactInfoSchema>({
    resolver: zodResolver(contactInfoSchema),

    defaultValues: {
      city: userData?.city,
      state: userData?.state,
      birthday: userData?.birthday,
      phone_number: userData?.phone_number
    },

    mode: 'onSubmit'
  });

  const onSubmit = (data: ContactInfoSchema) => {
    if (!userData) return;

    mutation.mutate({
      ...userData,
      ...data
    });
  };

  if (isUserProfileLoading) {
    return <Typography variant="body-strong">{'Loading...'}</Typography>;
  }

  const resetAlerts = () => {
    setHasErrors(false);
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild onClick={resetAlerts}>
          <Typography
            variant="body-strong"
            className="transition-colors duration-200 ease-out text-primary-g-600 cursor-pointer underline hover:text-primary-g-800"
          >
            {'Contact Info'}
          </Typography>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
          <DialogHeader className="mt-12">
            <DialogTitle>
              <Typography variant="heading-md" className="text-primary-g-900">
                Edit your contact info
              </Typography>
            </DialogTitle>

            {hasErrors && (
              <Alert
                variant="critical"
                onClose={() => setHasErrors(false)}
                label={'Please fill in all required fields'}
              />
            )}
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={(event?: BaseSyntheticEvent) => event?.preventDefault()}
              noValidate
            >
              <div id="contactInfo" className="flex flex-col gap-4 mt-4">
                <Typography
                  variant="body-strong"
                  className="text-primary-g-700"
                >
                  {'Contact Information'}
                </Typography>
                <div id="additionalInfo" className="flex flex-col gap-4">
                  <TextInput
                    noSuffix
                    type="text"
                    fieldName="phone_number"
                    placeholder="Phone Number"
                    defaultValue={userData?.phone_number}
                  />
                </div>
              </div>

              <div id="residencyInfo" className="flex flex-col gap-4 mt-8">
                <Typography
                  variant="body-strong"
                  className="text-primary-g-700"
                >
                  {'Where are you based?'}
                </Typography>
                <div className="flex flex-row gap-4">
                  <TextInput
                    name="city"
                    type="text"
                    fieldName="city"
                    placeholder="City name"
                    autoComplete="address-level2"
                  />

                  <Dropdown
                    fieldName="state"
                    placeholder="Select State"
                    options={Array.from(US_STATES) ?? []}
                  />
                </div>
              </div>

              <div id="birthdayInfo" className="flex flex-col gap-4 mt-8">
                <Typography
                  variant="body-strong"
                  className="text-primary-g-700"
                >
                  {"What's your birthday?"}
                </Typography>

                <div className="flex flex-row gap-4">
                  <TextInput
                    noSuffix
                    type="date"
                    fieldName="birthday"
                    placeholder="mm/dd/yyyy"
                  />
                </div>
              </div>
            </form>
          </Form>

          <DialogFooter className="sm:justify-end mt-8">
            <DialogClose asChild>
              <Button type="button" label="Cancel" variant="tertiary" />
            </DialogClose>

            <Button
              type="button"
              variant="primary"
              label="Save Your Changes"
              onClick={e => onSubmit(form.getValues())}
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HydrationBoundary>
  );
};

export default ContactInfoForm;
