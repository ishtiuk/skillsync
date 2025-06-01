import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';

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
import { TextInput, Form } from '@workspace/ui/components/form';
import { Typography } from '@workspace/ui/components/typography';
import { LinkComponent } from '@workspace/ui/components/link/LinkComponent';

import { zodResolver } from '@hookform/resolvers/zod';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { socialSchema, SocialSchema } from '../schemas/SocialSchema';

import { updateUserProfile } from '@/app/profile/_modules/common/api/mutations/update-profile';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { IconButton } from '@workspace/ui/components/icon-button/IconButton';
import { PlusIcon } from '@workspace/ui/icons';
import { getUserOptions } from '../api/queries/get-user';

const SocialsForm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onError: error => setHasErrors(true),
    onSuccess: () => {
      setIsSuccess(true);

      setTimeout(() => {
        setOpen(false);
      }, 100);

      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  const queryClient = getQueryClient();
  const { data: userData } = useQuery(getUserOptions);

  const form = useForm<SocialSchema>({
    resolver: zodResolver(socialSchema),

    defaultValues: {
      instagram_url: userData?.instagram_url || '',
      linkedin_url: userData?.linkedin_url || '',
      x_twitter_url: userData?.x_twitter_url || '',
      facebook_url: userData?.facebook_url || '',
      personal_website_url: userData?.personal_website_url || ''
    },

    mode: 'onSubmit'
  });

  const onSubmit = (data: SocialSchema) => {
    if (!userData) return;
    mutation.mutate({
      ...userData,
      ...data
    });
  };

  const resetAlerts = () => {
    setHasErrors(false);
    setIsSuccess(false);
  };

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild onClick={resetAlerts}>
          <span className="flex items-center">
            <Typography
              variant="caption-strong"
              className="w-fit cursor-pointer rounded-full bg-neutral-n-200 p-2 text-primary-g-900 transition-colors duration-200 hover:bg-neutral-n-300"
            >
              <PlusIcon size={20} />
            </Typography>

            {!userData?.instagram_url &&
            !userData?.linkedin_url &&
            !userData?.x_twitter_url &&
            !userData?.facebook_url &&
            !userData?.personal_website_url ? (
              <Typography variant="body" className="text-neutral-n-600">
                <span className="ml-2">Add Your Socials</span>
              </Typography>
            ) : null}
          </span>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
          <DialogHeader className="mt-12">
            <DialogTitle>
              <Typography variant="heading-md" className="text-primary-g-900">
                Add Your Socials
              </Typography>
            </DialogTitle>

            {/* {isSuccess && (
              <Alert
                variant="success"
                onClose={() => setIsSuccess(false)}
                label={'Your changes have been saved'}
              />
            )} */}

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
              <div id="socialsInfo" className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-4">
                  <TextInput
                    noSuffix
                    type="text"
                    fieldName="instagram_url"
                    placeholder="Instagram URL"
                  />

                  <TextInput
                    noSuffix
                    type="text"
                    fieldName="linkedin_url"
                    placeholder="LinkedIn URL"
                  />

                  <TextInput
                    noSuffix
                    type="text"
                    fieldName="x_twitter_url"
                    placeholder="X/Twitter URL"
                  />

                  <TextInput
                    noSuffix
                    type="text"
                    fieldName="facebook_url"
                    placeholder="Facebook URL"
                  />

                  <TextInput
                    noSuffix
                    type="text"
                    fieldName="personal_website_url"
                    placeholder="Personal Website URL"
                  />
                </div>
              </div>
            </form>
          </Form>

          <DialogFooter className="sm:justify-end mt-8">
            <DialogClose asChild>
              <Button type="button" variant="tertiary" label="Cancel" />
            </DialogClose>

            <Button
              type="button"
              variant="primary"
              label="Save Your Changes"
              onClick={() => onSubmit(form.getValues())}
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HydrationBoundary>
  );
};

export default SocialsForm;
