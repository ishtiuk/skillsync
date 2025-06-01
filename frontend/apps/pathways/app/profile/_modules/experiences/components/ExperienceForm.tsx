import { Button } from '@workspace/ui/components/button';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Switch } from '@workspace/ui/components/forms/switches/Switch';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@workspace/ui/components/typography';
import { TextInput, Dropdown, Form } from '@workspace/ui/components/form';

import { experienceSchema, ExperienceSchema } from '../schema';

import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import { GetExperienceResponse } from '../types';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { PhosphorIcon } from '@workspace/ui/icons/PhosphorIcon';
import { getUserOptions } from '../../common/api/queries/get-user';
import { createExperience } from '../api/mutations/createExperience';
import { updateExperience } from '../api/mutations/updateExperience';

import {
  convertMonthNameToNumber,
  convertNumberToMonthName
} from '@/lib/utils/datetime';

type ExperienceFormProps = {
  open?: boolean;
  isEditing?: boolean;
  trigger?: React.ReactNode;
  data?: GetExperienceResponse;
  onOpenChange?: (open: boolean) => void;
  onOpenAddExperiencePopup?: (open: boolean) => void;
};

const ExperienceForm = ({
  open,
  data,
  trigger,
  onOpenChange,
  isEditing = false,
  onOpenAddExperiencePopup
}: ExperienceFormProps) => {
  const [hasErrors, setHasErrors] = useState<boolean>(false);

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const createMutation = useMutation({
    mutationFn: createExperience,
    onError: error => setHasErrors(true),

    onSuccess: () => {
      form.reset();
      onOpenChange?.(false);
      onOpenAddExperiencePopup?.(true);
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateExperience,
    onError: error => setHasErrors(true),
    onSuccess: () => {
      setTimeout(() => {
        buttonRef.current?.click();
      }, 100);

      queryClient.invalidateQueries({ queryKey: ['experience'] });
    }
  });

  const queryClient = getQueryClient();
  const { data: userData } = useQuery(getUserOptions);

  const form = useForm<ExperienceSchema>({
    resolver: zodResolver(experienceSchema),

    defaultValues: {
      is_current: data?.is_current || false,
      company_name: data?.company_name || '',
      position_title: data?.position_title || '',
      employment_type: data?.employment_type || '',
      end_year: data?.end_year?.toString() || '',
      start_year: data?.start_year?.toString() || '',
      end_month: convertNumberToMonthName(data?.end_month ?? 0) || '',
      start_month: convertNumberToMonthName(data?.start_month ?? 0) || ''
    },

    mode: 'onSubmit'
  });

  const resetAlerts = () => {
    setHasErrors(false);
  };

  const onSubmit = async (formData: ExperienceSchema) => {
    const isFormValid = await form.trigger();

    if (!isFormValid) {
      setHasErrors(true);
      return;
    }

    if (!userData) return;
    const payload = {
      ...formData,
      logo_url: '',
      user_id: userData?.id,
      start_year: parseInt(formData.start_year),
      end_year: parseInt(formData.end_year ?? '') || null,
      is_current: form.getValues().is_current ? true : false,
      start_month: convertMonthNameToNumber(formData.start_month),
      end_month: convertMonthNameToNumber(formData.end_month ?? '') || null
    };

    if (isEditing) {
      updateMutation.mutate({
        id: data?.id || '',
        request: payload
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name && form.formState.errors[name]) {
        setHasErrors(false);
        form.clearErrors(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    if (open) resetAlerts();
  }, [open]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild onClick={resetAlerts}>
          {isEditing ? (
            <span>
              <PhosphorIcon
                size={24}
                iconVariant="PencilSimple_fill"
                className="text-neutral-n-800 cursor-pointer transition-colors duration-200 hover:text-primary-g-700"
              />
            </span>
          ) : (
            <>{trigger && <div>{trigger}</div>}</>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
          <DialogHeader className="mt-12">
            <DialogTitle>
              <Typography variant="heading-md" className="text-primary-g-900">
                {isEditing ? 'Edit your experience' : 'Add your experience'}
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
              <div id="experienceInfo" className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-4">
                  <TextInput
                    type="text"
                    fieldName="position_title"
                    placeholder="Position Title"
                    rules={{ required: 'Position Title is required' }}
                  />
                  <TextInput
                    type="text"
                    fieldName="company_name"
                    placeholder="Company Name"
                    rules={{ required: 'Company Name is required' }}
                  />
                  <Dropdown
                    fieldName="employment_type"
                    placeholder="Employment Type"
                    options={['Full-time', 'Part-time', 'Contract']}
                    rules={{ required: 'Employment Type is required' }}
                  />

                  <div className="max-w-fit min-w-fit">
                    <Switch
                      id="is_current"
                      label="Current Role"
                      className="max-w-fit min-w-full"
                      enabled={form.watch('is_current')}
                      onChange={enabled => form.setValue('is_current', enabled)}
                    />
                  </div>
                </div>
              </div>

              <div id="dojInfo" className="flex flex-col gap-4 mt-4">
                <div className="flex flex-row gap-4">
                  <Dropdown
                    fieldName="start_month"
                    placeholder="Start Month"
                    options={[
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December'
                    ]}
                  />
                  <TextInput
                    type="text"
                    fieldName="start_year"
                    placeholder="Start Year"
                    rules={{ required: 'Start Year is required' }}
                  />
                </div>
                {form.watch('is_current') ? null : (
                  <div className="flex flex-row gap-4">
                    <Dropdown
                      fieldName="end_month"
                      placeholder="End Month"
                      rules={{ required: 'End Month is required' }}
                      options={[
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December'
                      ]}
                    />
                    <TextInput
                      type="text"
                      fieldName="end_year"
                      placeholder="End Year"
                      rules={{ required: 'End Year is required' }}
                    />
                  </div>
                )}
              </div>
            </form>
          </Form>

          <DialogFooter className="sm:justify-end mt-8">
            <DialogClose asChild ref={buttonRef}>
              <Button type="button" variant="tertiary" label="Cancel" />
            </DialogClose>

            <Button
              type="button"
              variant="primary"
              label="Save Position"
              onClick={() => onSubmit(form.getValues())}
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HydrationBoundary>
  );
};

export default ExperienceForm;
