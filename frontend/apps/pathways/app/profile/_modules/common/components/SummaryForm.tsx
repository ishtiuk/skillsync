import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';

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

import { useForm } from 'react-hook-form';
import { Form, TextArea } from '@workspace/ui/components/form';
import { Typography } from '@workspace/ui/components/typography';

import { zodResolver } from '@hookform/resolvers/zod';
import { summarySchema, SummarySchema } from '../schemas/SummarySchema';
import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import { getQueryClient } from '@/lib/api/getQueryClient';
import { Alert } from '@workspace/ui/components/alert/Alert';

import { updateUserProfile } from '@/app/profile/_modules/common/api/mutations/update-profile';
import { getUserOptions } from '../api/queries/get-user';

const SummaryForm = ({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onError: error => setHasErrors(true),
    onSuccess: () => {
      setIsSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
      }, 100);

      queryClient.invalidateQueries({ queryKey: ['user'] });
    }
  });

  const queryClient = getQueryClient();
  const { data: userData } = useQuery(getUserOptions);

  const form = useForm<SummarySchema>({
    resolver: zodResolver(summarySchema),

    defaultValues: {
      career_summary: userData?.career_summary
    },

    mode: 'onSubmit'
  });

  const onSubmit = (data: SummarySchema) => {
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

  useEffect(() => {
    if (open) resetAlerts();
  }, [open]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
          <DialogHeader className="mt-12">
            <DialogTitle>
              <Typography variant="heading-md" className="text-primary-g-900">
                Write Your Summary
              </Typography>
            </DialogTitle>

            <DialogDescription>
              <Typography variant="DEFAULT">
                Write about your years of experience, industry, achievements or
                skills within the climate space. This space is dedicated for you
                to tell everyone your story.
              </Typography>
            </DialogDescription>

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
                  <TextArea
                    noSuffix
                    fieldName="career_summary"
                    placeholder="Write your story here"
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
              label="Save Your Summary"
              onClick={() => onSubmit(form.getValues())}
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HydrationBoundary>
  );
};

export default SummaryForm;
