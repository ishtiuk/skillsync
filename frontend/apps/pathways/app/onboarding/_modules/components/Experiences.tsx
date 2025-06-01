import { Button } from '@workspace/ui/components/button';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Switch } from '@workspace/ui/components/forms/switches/Switch';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TextInput, Form } from '@workspace/ui/components/form';
import { Typography } from '@workspace/ui/components/typography';

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

import { getQueryClient } from '@/lib/api/getQueryClient';
import { convertMonthNameToNumber } from '@/lib/utils/datetime';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { createExperience } from '@/app/profile/_modules/experiences/api/mutations/createExperience';

import {
  experienceSchema,
  ExperienceSchema
} from '@/app/profile/_modules/experiences/schema';

import { monthNames } from '@/lib/constants/dateConstants';
import { useRouter } from 'next/navigation';
import { ListItem } from '@workspace/ui/components/list-item/ListItem';
import { AvatarCompany } from '@workspace/ui/components/avatar-company/AvatarCompany';
import { getExperiencesOptions } from '@/app/profile/_modules/experiences/api/queries/getExperiences';
import { User } from '@/app/profile/_modules/common/types';

const Experiences = () => {
  const router = useRouter();
  const queryClient = getQueryClient();
  const [showForm, setShowForm] = useState<boolean>(true);
  const user = queryClient.getQueryData(['user']) as User;
  const [hasErrors, setHasErrors] = useState<boolean>(false);

  const { data: experiences } = useQuery(getExperiencesOptions);

  const createMutation = useMutation({
    mutationFn: createExperience,
    onError: error => setHasErrors(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      setShowForm(false);
      form.reset();
    }
  });

  const form = useForm<ExperienceSchema>({
    resolver: zodResolver(experienceSchema),
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

    if (!user) return;
    const payload = {
      ...formData,
      logo_url: '',
      user_id: user?.id,
      start_year: parseInt(formData.start_year),
      end_year: parseInt(formData.end_year ?? '') || null,
      is_current: form.getValues().is_current ? true : false,
      start_month: convertMonthNameToNumber(formData.start_month),
      end_month: convertMonthNameToNumber(formData.end_month ?? '') || null
    };

    createMutation.mutate(payload);
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
    if (experiences && experiences.length > 0) {
      setShowForm(false);
    }
  }, [experiences]);

  return (
    <div>
      <div className="border p-4 rounded-[16px]">
        <Typography variant="caption-strong">
          {showForm ? 'Enter Role Information' : 'Your Experiences'}
        </Typography>

        {hasErrors && (
          <Alert
            variant="critical"
            onClose={() => setHasErrors(false)}
            label={'Please fill in all required fields'}
          />
        )}

        {showForm ? (
          <Form {...form}>
            <form
              onSubmit={(event?: BaseSyntheticEvent) => event?.preventDefault()}
              noValidate
            >
              <div id="experienceInfo" className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-4 w-full">
                  <Switch
                    id="is_current"
                    className="!w-full !max-w-full"
                    label="Is This Your Current Role"
                    enabled={form.watch('is_current')}
                    onChange={enabled => form.setValue('is_current', enabled)}
                  />

                  <div className="flex gap-4">
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
                  </div>

                  <FormField
                    name="employment_type"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full gap-2">
                        <FormLabel className={'text-black text-xs font-medium'}>
                          What type role was this?
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
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div id="dojInfo" className="flex flex-col gap-4 mt-4">
                <Typography variant="caption-strong" className="-mb-[34px]">
                  When did you start?
                </Typography>

                <div className="flex flex-row gap-4">
                  <FormField
                    name="start_month"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full gap-2 mt-6">
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Start month" />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent className="flex flex-col">
                            {monthNames.map(month => (
                              <SelectItem value={month}>{month}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="mt-4 w-full">
                    <TextInput
                      label=""
                      type="text"
                      fieldName="start_year"
                      placeholder="Start Year"
                      rules={{ required: 'Start Year is required' }}
                    />
                  </div>
                </div>

                {form.watch('is_current') ? null : (
                  <div className="flex flex-col">
                    <Typography variant="caption-strong" className="-mb-[18px]">
                      When did you leave?
                    </Typography>

                    <div className="flex flex-row gap-4">
                      <FormField
                        name="end_month"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full gap-2 mt-6">
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="End month" />
                                </SelectTrigger>
                              </FormControl>

                              <SelectContent className="flex flex-col">
                                {monthNames.map(month => (
                                  <SelectItem value={month}>{month}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="mt-4 w-full">
                        <TextInput
                          label=""
                          type="text"
                          fieldName="end_year"
                          placeholder="End Year"
                          rules={{ required: 'End Year is required' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>

            <div className="flex gap-4 mt-8">
              <Button
                type="button"
                label="Save Role"
                variant={
                  experiences && experiences.length > 0
                    ? 'secondary'
                    : 'tertiary'
                }
                className="flex-1"
                onClick={() => onSubmit(form.getValues())}
                disabled={
                  !form.formState.isDirty || form.formState.isSubmitting
                }
              />
              {experiences && experiences.length > 0 && (
                <Button
                  type="button"
                  label="Cancel"
                  variant="tertiary"
                  className="flex-1"
                  onClick={() => {
                    setShowForm(false);
                    form.reset();
                  }}
                />
              )}
            </div>
          </Form>
        ) : (
          <>
            {experiences && experiences.length > 0 && (
              <div className="mt-8 flex flex-col gap-4">
                {experiences.map(experience => (
                  <ListItem
                    key={experience.id}
                    title={experience.position_title}
                    className="shadow-customShadow !px-4 !py-2 rounded-[10px]"
                    subTitle={`${experience.company_name} • ${experience.employment_type}`}
                    ContentImage={
                      <AvatarCompany
                        size="32px"
                        color={'blue'}
                        profileIMG={''}
                        AvatarType="alt"
                        avatarId={experience.id}
                        companyName={experience.company_name}
                      />
                    }
                    ListItemRight={
                      <div className="py-4">
                        {experience.start_year} -{' '}
                        {experience.end_year || 'Present'}
                      </div>
                    }
                  />
                ))}
              </div>
            )}

            <Button
              type="button"
              label="Add Role"
              variant="tertiary"
              className="mx-auto w-full mt-8"
              onClick={() => {
                setShowForm(true);
                form.reset();
              }}
            />
          </>
        )}
      </div>

      <div className="flex gap-4 mt-10">
        {/* <Button
          label="Skip"
          size="large"
          type="button"
          className="w-1/2"
          variant="secondary"
          onClick={() => (window.location.href = '/home?onboarding=true')}
        /> */}

        <Button
          size="large"
          type="submit"
          label="Finish"
          variant="primary"
          className="w-full"
          onClick={() => (window.location.href = '/home?onboarding=true')}
        />
      </div>
    </div>
  );
};

export default Experiences;
