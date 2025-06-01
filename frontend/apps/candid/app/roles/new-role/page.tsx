'use client';

import Tiptap from '@/components/TipTap';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { navigationItems } from '@/lib/navigationItems';
import { Button } from '@workspace/ui/components/button';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { Typography } from '@workspace/ui/components/typography';
import { Switch } from '@workspace/ui/components/forms/switches/Switch';
import { roleSchema, RoleSchema } from '../_modules/schemas/RoleSchema';
import { Dropdown, Form, TextInput } from '@workspace/ui/components/form';
import React, { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import { NavigationPageWrapper } from '@workspace/ui/components/navigation-page-wrapper';

import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { createJobRole } from '../_modules/api/mutations/createRole';
import { getUserOptions } from '@/app/login/_modules/api/queries/getUser';
import { CreateDownloadFileUrlResponse } from '@/app/profile/_modules/types';
import { getCompanyOptions } from '@/app/profile/_modules/api/queries/getCompany';
import { AvatarPeople } from '@workspace/ui/components/avatar-people/AvatarPeople';
import { ContextualAlert } from '@workspace/ui/components/contextual-alerts/ContextualAlert';
import SegmentedControl from '@workspace/ui/components/segmented-controller/SegmentedController';
import { createDownloadProfilePhotoUrl } from '@/app/profile/_modules/api/mutations/profile-photo/createDownloadProfilePhotoUrl';

const RowSpacer = () => (
  <div className="flex flex-row gap-2 justify-between items-center my-4">
    <hr
      style={{
        flexGrow: 1,
        borderWidth: '1px',
        borderColor: 'var(--Neutral-N300, #E5DFD8'
      }}
    />
  </div>
);

const NewRolePage = () => {
  const initialToggle = 0;
  const router = useRouter();
  const queryClient = getQueryClient();
  const [titleMessage, setTitleMessage] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [hasErrorMessage, setHasErrorMessage] = useState<string | null>(null);

  const { data: userData } = useQuery(getUserOptions);
  const { data: companyData } = useQuery(getCompanyOptions);

  const createDownloadProfilePhotoUrlMutation = useMutation({
    mutationFn: createDownloadProfilePhotoUrl,
    onError: (error: any) =>
      setHasErrorMessage(
        error?.response?.data?.detail || 'An error occurred. Please try again!'
      ),

    onSuccess: (data: CreateDownloadFileUrlResponse) => {
      if (data.download_url) setProfilePhoto(data.download_url);
    }
  });

  const createJobRoleMutation = useMutation({
    mutationFn: createJobRole,
    onError: (error: any) => {
      setHasErrorMessage(
        error?.response?.data?.detail || 'An error occurred. Please try again!'
      );
    },

    onSuccess: () => {
      form.reset();
      router.push('/roles');
      queryClient.invalidateQueries({ queryKey: ['jobRole'] });
    }
  });

  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),

    defaultValues: {
      title: '',
      job_category: '',
      position_type: '',
      level_of_experience: '',
      role_description: '',
      primary_responsibilities: '',
      required_qualifications: '',
      desired_qualifications: '',
      education_level: '',
      specific_education_requirements: '',
      workplace_type: 'Onsite',
      city: '',
      state: '',
      pay_type: '',
      minimum_pay: '',
      maximum_pay: '',
      pay_frequency: 'Weekly',
      compensation_benefits: '',
      show_recruiter: false,
      closing_date: '',
      external_link: '',
      is_resume_required: false,
      is_portfolio_required: false,
      is_cover_letter_required: false
    },

    mode: 'onSubmit'
  });

  const onLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const toggleWorkplace = (value: string, index: number) => {
    form.setValue('workplace_type', value);
  };

  const toggleCompensationPayFrequency = (value: string, index: number) => {
    form.setValue('pay_frequency', value);
  };

  const handleSubmit = form.handleSubmit(async data => {
    const requiredFiles = [];

    if (data.is_resume_required) {
      requiredFiles.push('Resume');
    }

    if (data.is_cover_letter_required) {
      requiredFiles.push('Cover Letter');
    }

    if (data.is_portfolio_required) {
      requiredFiles.push('Portfolio');
    }

    createJobRoleMutation.mutate({
      ...data,
      pathway: companyData?.select_a_pathway!,
      required_files: requiredFiles.length > 0 ? requiredFiles : undefined
    });
  });

  useEffect(() => {
    form.watch('title') === '' ? setTitleMessage(true) : setTitleMessage(false);
  }, [form.watch('title')]);

  useEffect(() => {
    if (userData?.profile_picture_url) {
      createDownloadProfilePhotoUrlMutation.mutate({});
    }
  }, [profilePhoto]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavigationPageWrapper onClickCustom={onLogout} items={navigationItems}>
        <div className="w-full flex justify-between align-center px-12 pt-[30px] pb-6">
          <Typography variant="heading-md">Post a Role</Typography>
        </div>
        <Form {...form}>
          <form
            noValidate
            onSubmit={(e?: BaseSyntheticEvent) => e?.preventDefault()}
            className="flex w-full py-6 px-12 items-start gap-6 bg-neutral-n-100"
          >
            <div className="flex flex-col items-start gap-6 flex-1 bg-white p-6 basis-2/3 border border-solid rounded-2xl w-full">
              {titleMessage && (
                <Alert
                  variant="neutral"
                  onClick={() => setTitleMessage(false)}
                  className="!w-full xl:whitespace-nowrap"
                  label="Remember to write the name of your role; you need it to post!"
                />
              )}

              {hasErrorMessage !== null && (
                <Alert
                  variant="critical"
                  label={hasErrorMessage}
                  onClick={() => setHasErrorMessage(null)}
                  className="!w-full xl:whitespace-nowrap"
                />
              )}

              <div className="w-full">
                <div id="primaryInfo" className="flex flex-col gap-4 mt-4">
                  <TextInput
                    type="text"
                    fieldName="title"
                    placeholder="Role Title"
                    rules={{ required: 'Role Title is required' }}
                  />

                  <Dropdown
                    fieldName="job_category"
                    placeholder="Select a Job Category"
                    options={[
                      'software-engineering',
                      'supply-chain',
                      'HR',
                      'advocacy-policy',
                      'climate-sustainability',
                      'investment',
                      'sales-account-management',
                      'content',
                      'marketing-design',
                      'product',
                      'data',
                      'education',
                      'finance-legal-compliance',
                      'operations-program-management-strategy',
                      'science'
                    ]}
                    rules={{ required: 'Job category is required' }}
                  />

                  <div className="flex flex-row gap-4">
                    <Dropdown
                      fieldName="position_type"
                      placeholder="Select a Position Type"
                      options={[
                        'Full-Time',
                        'Part-Time',
                        'Contract',
                        'Internship',
                        'Volunteer'
                      ]}
                    />

                    <Dropdown
                      fieldName="level_of_experience"
                      placeholder="Select a Level of Experience"
                      options={[
                        'Entry',
                        'Mid',
                        'Intermediate',
                        'Senior',
                        'Executive'
                      ]}
                    />
                  </div>

                  <div>
                    <Typography variant="caption-strong" className="mb-2">
                      Role Description*
                    </Typography>

                    <Tiptap
                      content={form.watch('role_description')}
                      onUpdate={(content: string) => {
                        form.setValue('role_description', content);
                      }}
                    />

                    {form.formState.errors.role_description && (
                      <ContextualAlert
                        variant="critical"
                        label={form.formState.errors.role_description.message!}
                      />
                    )}
                  </div>

                  <div>
                    <Typography variant="caption-strong" className="mb-2">
                      Primary Responsibilities
                    </Typography>

                    <Tiptap
                      content={form.watch('primary_responsibilities')!}
                      onUpdate={(content: string) => {
                        form.setValue('primary_responsibilities', content);
                      }}
                    />
                  </div>

                  <div>
                    <Typography variant="caption-strong" className="mb-2">
                      Required Qualifications:  
                    </Typography>

                    <Tiptap
                      content={form.watch('required_qualifications')!}
                      onUpdate={(content: string) => {
                        form.setValue('required_qualifications', content);
                      }}
                    />
                  </div>

                  <div>
                    <Typography variant="caption-strong" className="mb-2">
                      Desired Qualifications: 
                    </Typography>

                    <Tiptap
                      content={form.watch('desired_qualifications')!}
                      onUpdate={(content: string) => {
                        form.setValue('desired_qualifications', content);
                      }}
                    />
                  </div>
                </div>

                <RowSpacer />

                <div id="educationInfo" className="flex flex-col gap-4">
                  <Typography variant="body-strong" className="mb-4">
                    Education
                  </Typography>

                  <Dropdown
                    fieldName="education_level"
                    placeholder="Select an Education Level"
                    options={[
                      'High School',
                      'Associate',
                      'Bachelor',
                      'Master',
                      'Doctorate'
                    ]}
                  />

                  <div>
                    <Typography variant="caption-strong" className="mb-2">
                      Specific Education Requirements
                    </Typography>

                    <Tiptap
                      content={form.watch('specific_education_requirements')!}
                      onUpdate={(content: string) => {
                        form.setValue(
                          'specific_education_requirements',
                          content
                        );
                      }}
                    />
                  </div>
                </div>

                <RowSpacer />

                <div id="workplaceInfo" className="flex flex-col gap-4">
                  <Typography variant="body-strong" className="mb-4">
                    Workplace
                  </Typography>

                  <div id="workplace_type">
                    <Typography variant="caption-strong" className="mb-2">
                      Workplace Type*
                    </Typography>

                    <SegmentedControl
                      name={'workplace_type'}
                      callback={toggleWorkplace}
                      segments={[
                        {
                          ref: useRef(),
                          label: 'Onsite',
                          value: 'Onsite'
                        },
                        {
                          label: 'Remote',
                          value: 'Remote',
                          ref: useRef()
                        },
                        {
                          label: 'Hybrid',
                          value: 'Hybrid',
                          ref: useRef()
                        }
                      ]}
                      defaultIndex={initialToggle}
                    />

                    {form.formState.errors.workplace_type && (
                      <ContextualAlert
                        variant="critical"
                        label={form.formState.errors.workplace_type.message!}
                      />
                    )}
                  </div>

                  <div className="flex gap-x-4">
                    <TextInput
                      type="text"
                      fieldName="city"
                      placeholder="City"
                    />

                    <Dropdown
                      fieldName="state"
                      placeholder="State"
                      options={[
                        'Alabama',
                        'Alaska',
                        'Arizona',
                        'Arkansas',
                        'California',
                        'Colorado',
                        'Connecticut',
                        'Delaware',
                        'Florida',
                        'Georgia',
                        'Hawaii',
                        'Idaho',
                        'Illinois',
                        'Indiana',
                        'Iowa',
                        'Kansas',
                        'Kentucky',
                        'Louisiana',
                        'Maine',
                        'Maryland',
                        'Massachusetts',
                        'Michigan',
                        'Minnesota',
                        'Mississippi',
                        'Missouri',
                        'Montana',
                        'Nebraska',
                        'Nevada',
                        'New Hampshire',
                        'New Jersey',
                        'New Mexico',
                        'New York',
                        'North Carolina',
                        'North Dakota',
                        'Ohio',
                        'Oklahoma',
                        'Oregon',
                        'Pennsylvania',
                        'Rhode Island',
                        'South Carolina',
                        'South Dakota',
                        'Tennessee',
                        'Texas',
                        'Utah',
                        'Vermont',
                        'Virginia',
                        'Washington',
                        'West Virginia',
                        'Wisconsin',
                        'Wyoming'
                      ]}
                    />
                  </div>
                </div>

                <RowSpacer />

                <div id="compensationInfo" className="flex flex-col gap-4">
                  <Typography variant="body-strong" className="mb-4">
                    Compensation
                  </Typography>

                  <div className="flex gap-4">
                    <Dropdown
                      fieldName="pay_type"
                      placeholder="Pay Type"
                      options={['Hourly', 'Monthly', 'Annual']}
                    />

                    <TextInput
                      type="text"
                      fieldName="minimum_pay"
                      placeholder="Minimum"
                    />

                    <TextInput
                      type="text"
                      fieldName="maximum_pay"
                      placeholder="Maximum"
                    />
                  </div>

                  <div>
                    <Typography variant="caption-strong" className="mb-2">
                      Pay frequency
                    </Typography>

                    <SegmentedControl
                      name={'pay_frequency'}
                      callback={toggleCompensationPayFrequency}
                      segments={[
                        {
                          ref: useRef(),
                          label: 'Weekly',
                          value: 'Weekly'
                        },
                        {
                          label: 'Bi-Weekly',
                          value: 'Bi-Weekly',
                          ref: useRef()
                        },
                        {
                          label: 'Monthly',
                          value: 'Monthly',
                          ref: useRef()
                        }
                      ]}
                      defaultIndex={initialToggle}
                    />
                  </div>

                  <div>
                    <Typography variant="caption-strong" className="mb-2">
                      Compensation & Benefits Information
                    </Typography>

                    <Tiptap
                      content={form.watch('compensation_benefits')!}
                      onUpdate={(content: string) => {
                        form.setValue('compensation_benefits', content);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-6 basis-1/3">
              <div className="flex flex-col items-start self-stretch border rounded-2xl bg-white">
                <div className="flex py-4 px-6 items-center gap-2 self-stretch border-b-2 border-neutral-n-100">
                  <div className="flex items-center gap-2">
                    <PhosphorIcon
                      iconVariant="FadersHorizontal_fill"
                      className="fill-neutral-n-500"
                    />
                    <Typography variant="body-strong">Role Settings</Typography>
                  </div>
                </div>

                <div className="flex flex-col py-4 px-6 items-start gap-6 self-stretch">
                  <div className="flex flex-col items-start gap-2 self-stretch">
                    <div className="flex flex-col justify-between w-full pb-3 border-b-2 border-neutral-n-100">
                      <div className="flex justify-between w-full mb-2">
                        <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                          <Typography variant="caption-strong">
                            Show Recruiter
                          </Typography>
                        </div>
                        <PhosphorIcon
                          iconVariant="User_fill"
                          className="fill-neutral-n-600"
                        />
                      </div>

                      <div className="flex justify-between w-full">
                        <div className="flex items-center gap-2">
                          <AvatarPeople
                            size="24px"
                            color="purple"
                            profileIMG={profilePhoto!}
                            avatarId="profile-picture"
                          />

                          <div>
                            <Typography variant="caption-strong">
                              {userData?.first_name} {userData?.last_name}
                            </Typography>
                            <Typography
                              variant="caption"
                              className="text-neutral-n-600"
                            >
                              {userData?.current_job_title}
                            </Typography>
                          </div>
                        </div>

                        <div className="-mr-4">
                          <Switch
                            label=""
                            id="show_recruiter"
                            enabled={form.watch('show_recruiter')}
                            onChange={e => form.setValue('show_recruiter', e)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between w-full pb-3 border-b-2 border-neutral-n-100">
                      <div className="flex justify-between w-full mb-4">
                        <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                          <Typography variant="caption-strong">
                            Closing Date
                          </Typography>
                        </div>
                        <PhosphorIcon
                          iconVariant="CalendarBlank_fill"
                          className="fill-neutral-n-600"
                        />
                      </div>

                      <div className="flex justify-between w-full">
                        <TextInput
                          type="date"
                          fieldName="closing_date"
                          placeholder="Closing Date"
                          rules={{
                            required: 'Closing Date is required'
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between w-full pb-3 border-b-2 border-neutral-n-100">
                      <div className="flex justify-between w-full mb-4">
                        <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                          <Typography variant="caption-strong">
                            External Link
                          </Typography>
                        </div>
                        <PhosphorIcon
                          iconVariant="LinkSimple_bold"
                          className="fill-neutral-n-600"
                        />
                      </div>

                      <div className="flex justify-between w-full">
                        <TextInput
                          type="text"
                          fieldName="external_link"
                          placeholder="Link to Position"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between w-full pb-3 border-b-2 border-neutral-n-100">
                      <div className="flex justify-between w-full mb-4">
                        <div className="flex items-center gap-1 flex-1 basis-0 self-stretch">
                          <Typography variant="caption-strong">
                            Required Files
                          </Typography>
                        </div>
                        <PhosphorIcon
                          iconVariant="Folder_fill"
                          className="fill-neutral-n-600"
                        />
                      </div>

                      <div className="flex items-center justify-between w-full">
                        <Typography variant="caption-strong">Resume</Typography>

                        <div className="-mr-4">
                          <Switch
                            id="is_resume_required"
                            enabled={form.watch('is_resume_required')}
                            onChange={enabled =>
                              form.setValue('is_resume_required', enabled)
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full">
                        <Typography variant="caption-strong">
                          Cover Letter
                        </Typography>

                        <div className="-mr-4">
                          <Switch
                            id="is_cover_letter_required"
                            enabled={form.watch('is_cover_letter_required')}
                            onChange={enabled =>
                              form.setValue('is_cover_letter_required', enabled)
                            }
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full">
                        <Typography variant="caption-strong">
                          Portfolio
                        </Typography>

                        <div className="-mr-4">
                          <Switch
                            id="is_portfolio_required"
                            enabled={form.watch('is_portfolio_required')}
                            onChange={enabled =>
                              form.setValue('is_portfolio_required', enabled)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="default"
                    label="Post Role"
                    variant="primary"
                    onClick={() => handleSubmit()}
                    className="w-full rounded-[16px]"
                  />
                </div>
              </div>
            </div>
          </form>
        </Form>
      </NavigationPageWrapper>
    </HydrationBoundary>
  );
};

export default NewRolePage;
