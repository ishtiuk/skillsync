'use client';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui/components/button';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { Typography } from '@workspace/ui/components/typography';
import { Switch } from '@workspace/ui/components/forms/switches/Switch';
import { Checkbox } from '@workspace/ui/components/forms/checkbox/Checkbox';
import {
  Dropdown,
  Form,
  TextArea,
  TextInput
} from '@workspace/ui/components/form';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';

import {
  useQuery,
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';
import { getQueryClient } from '@/lib/api/getQueryClient';

import {
  CompanyProfileSchema,
  companyProfileSchema
} from '../schemas/CompanyProfileSchema';
import { createCompany } from '../api/mutations/company/create-company';
import { updateCompany } from '../api/mutations/company/update-company';
import { createUploadCompanyLogoUrl } from '../api/mutations/company-logo/createUploadCompanyLogoUrl';
import {
  CreateDownloadFileUrlResponse,
  CreateUploadFileRespnse
} from '../types';
import { getCompanyOptions } from '../api/queries/getCompany';
import { AvatarCompany } from '@workspace/ui/components/avatar-company/AvatarCompany';
import { createDownloadCompanyLogoUrl } from '../api/mutations/company-logo/createDownloadCompanyLogoUrl';

type UploadEvent = React.ChangeEvent<HTMLInputElement>;

const benefitOptions = [
  {
    id: '401(k)',
    label: '401(k)',
    value: '401(k)',
    nameCheckbox: 'benefits'
  },
  {
    id: 'pension-plan',
    label: 'Pension Plan',
    value: 'Pension Plan',
    nameCheckbox: 'benefits'
  },
  {
    id: 'paid-maternity-leave',
    label: 'Paid Maternity Leave',
    value: 'Paid Maternity Leave',
    nameCheckbox: 'benefits'
  },
  {
    id: 'tuition-assistance',
    label: 'Tuition Assistance',
    value: 'Tuition Assistance',
    nameCheckbox: 'benefits'
  },
  {
    id: 'disability-insurance',
    label: 'Disability Insurance',
    value: 'Disability Insurance',
    nameCheckbox: 'benefits'
  },
  {
    id: 'medical-insurance',
    label: 'Medical Insurance',
    value: 'Medical Insurance',
    nameCheckbox: 'benefits'
  },
  {
    id: 'vision-insurance',
    label: 'Vision Insurance',
    value: 'Vision Insurance',
    nameCheckbox: 'benefits'
  },
  {
    id: 'dental-insurance',
    label: 'Dental Insurance',
    value: 'Dental Insurance',
    nameCheckbox: 'benefits'
  },
  {
    id: 'student-loan-assistance',
    label: 'Student Loan Assistance',
    value: 'Student Loan Assistance',
    nameCheckbox: 'benefits'
  },
  {
    id: 'paid-paternity-leave',
    label: 'Paid Paternity Leave',
    value: 'Paid Paternity Leave',
    nameCheckbox: 'benefits'
  },
  {
    id: 'commuter-benefits',
    label: 'Commuter Benefits',
    value: 'Commuter Benefits',
    nameCheckbox: 'benefits'
  },
  {
    id: 'health-reimbursement-account',
    label: 'Health Reimbursement Account',
    value: 'Health Reimbursement Account',
    nameCheckbox: 'benefits'
  },
  {
    id: 'health-savings-account',
    label: 'Health Savings Account',
    value: 'Health Savings Account',
    nameCheckbox: 'benefits'
  },
  {
    id: 'fitness-benefits',
    label: 'Fitness Benefits',
    value: 'Fitness Benefits',
    nameCheckbox: 'benefits'
  },
  {
    id: 'health-screening',
    label: 'Health Screening',
    value: 'Health Screening',
    nameCheckbox: 'benefits'
  },
  {
    id: 'preventative-care',
    label: 'Preventative Care',
    value: 'Preventative Care',
    nameCheckbox: 'benefits'
  }
];

const CompanyProfile = () => {
  const router = useRouter();
  const queryClient = getQueryClient();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [profilePhotoChild, setProfilePhotoChild] = useState<File | null>(null);

  const [uploadUrlFields, setUploadUrlFields] =
    useState<CreateUploadFileRespnse | null>(null);

  const { data: companyData, isLoading, isError } = useQuery(getCompanyOptions);

  const handleEditClick = () => {
    document.getElementById('upload-logo')?.click();
  };

  const uploadCompanyLogo = async () => {
    if (uploadUrlFields?.upload_url.fields) {
      const formData = new FormData();

      for (const key in uploadUrlFields.upload_url.fields) {
        formData.append(
          key,
          uploadUrlFields.upload_url.fields[
            key as keyof typeof uploadUrlFields.upload_url.fields
          ]
        );
      }

      formData.append('file', profilePhotoChild as Blob);

      try {
        const profilePhotoUploadRes = await fetch(
          uploadUrlFields.upload_url.url,
          {
            method: 'POST',
            body: formData
          }
        );

        const profilePhotoUploadResData = await profilePhotoUploadRes.json();
        console.log('profilePhotoUploadResData', profilePhotoUploadResData);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const createUploadCompanyLogoUrlmutation = useMutation({
    mutationFn: createUploadCompanyLogoUrl,
    onError: error => setHasErrors(true),
    onSuccess: (data: CreateUploadFileRespnse) => {
      console.log('data', data);
      setUploadUrlFields(data);
    }
  });

  const createDownloadCompanyLogoUrlMutation = useMutation({
    mutationFn: createDownloadCompanyLogoUrl,
    onError: error => console.log('error', error),
    onSuccess: (data: CreateDownloadFileUrlResponse) => {
      if (data.download_url) setProfilePhoto(data.download_url);
    }
  });

  const createCompanyMutation = useMutation({
    mutationFn: createCompany,
    onError: error => setHasErrors(true),

    onSuccess: async () => {
      form.reset();
      setIsSuccess(true);
      uploadCompanyLogo();
      queryClient.invalidateQueries({ queryKey: ['company'] });
    }
  });

  const updateCompanyMutation = useMutation({
    mutationFn: updateCompany,
    onError: error => setHasErrors(true),

    onSuccess: async () => {
      form.reset();
      setIsSuccess(true);
      uploadCompanyLogo();
      queryClient.invalidateQueries({ queryKey: ['company'] });
    }
  });

  const form = useForm<CompanyProfileSchema>({
    resolver: zodResolver(companyProfileSchema),
    defaultValues: {
      name: '',
      select_a_pathway: '',
      is_bipoc_owned: false,
      type: '',
      size: '',
      no_of_employees: '',
      location: '',
      city: '',
      state: '',
      overview: ''
    },
    mode: 'onSubmit'
  });

  useEffect(() => {
    if (companyData) {
      form.reset({
        name: companyData?.name || '',
        type: companyData?.type || '',
        size: companyData?.size || '',
        city: companyData?.city || '',
        state: companyData?.state || '',
        benefits: companyData?.benefits,
        overview: companyData?.overview || '',
        location: companyData?.location || '',
        is_bipoc_owned: companyData?.is_bipoc_owned || false,
        select_a_pathway: companyData?.select_a_pathway || '',
        no_of_employees: companyData?.no_of_employees!.toString() || ''
      });

      if (companyData?.logo_url) {
        createDownloadCompanyLogoUrlMutation.mutate({
          object_key: companyData?.logo_url,
          filename: companyData?.logo_url.split('/').pop() || '',
          content_type: `image/${companyData?.logo_url?.split('.').pop()}`
        });
      }
    }
  }, [companyData, form.reset]);

  const handleSubmit = form.handleSubmit(async data => {
    console.log(data);

    if (!companyData) {
      createCompanyMutation.mutate({
        ...data,
        country: 'United States',
        no_of_employees: Number(data.no_of_employees!),
        logo_url: `${uploadUrlFields?.upload_url.url}/${uploadUrlFields?.upload_url.fields.key}`
      });
    } else {
      updateCompanyMutation.mutate({
        ...companyData,
        ...data,
        no_of_employees: Number(
          data.no_of_employees! || companyData.no_of_employees
        )
      });
    }
  });

  const handleCompanyLogoUpload = async (e: UploadEvent) => {
    setProfilePhotoChild(e?.target?.files && e?.target?.files[0]);

    const res = await createUploadCompanyLogoUrlmutation.mutateAsync({
      filename: (e?.target?.files && e?.target?.files[0]?.name)!,
      content_type: (e?.target?.files && e?.target?.files[0]?.type)!
    });
  };

  if (isLoading) return <div>Loading...</div>;
  console.log('companyData', companyData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Form {...form}>
        <form
          noValidate
          onSubmit={(e?: BaseSyntheticEvent) => e?.preventDefault()}
          className="flex w-full py-6 px-12 items-start gap-6 bg-neutral-n-100"
        >
          <div className="flex flex-col items-start gap-6 flex-1 bg-white p-6 basis-2/3 border border-solid rounded-2xl w-full">
            <div className="flex items-center gap-2">
              <PhosphorIcon
                size={24}
                iconVariant="Buildings_fill"
                className="fill-neutral-n-500"
              />
              <Typography variant="body-strong">Company Information</Typography>
            </div>

            {hasErrors && (
              <div className="w-full">
                <Alert
                  variant="critical"
                  className="w-full"
                  onClose={() => setHasErrors(false)}
                  label={'Please fill in all required fields'}
                />
              </div>
            )}

            {isSuccess && (
              <div className="w-full">
                <Alert
                  variant="success"
                  className="w-full"
                  onClose={() => setHasErrors(false)}
                  label={'Company profile updated successfully'}
                />
              </div>
            )}

            <div className="flex justify-between items-center w-full bg-neutral-n-100 p-4 rounded-[16px]">
              <div className="flex items-center gap-4">
                {!profilePhotoChild && (
                  <AvatarCompany
                    size={'64px'}
                    profileIMG={profilePhoto!}
                    avatarId={companyData?.id!}
                    companyName={companyData?.name}
                  />
                )}

                {profilePhotoChild && (
                  <Image
                    width={64}
                    height={64}
                    alt="Selected image"
                    src={URL.createObjectURL(profilePhotoChild)}
                  />
                )}

                {!companyData?.logo_url && (
                  <Typography variant="body" className="w-[80%]">
                    Your company logo will appear when job seekers browse
                    pathways. Please upload a square format of our logo, no
                    transparency.
                  </Typography>
                )}
              </div>

              <Button
                variant="tertiary"
                onClick={handleEditClick}
                leftIcon={
                  profilePhotoChild || companyData?.logo_url
                    ? 'PencilSimpleLine_bold'
                    : 'PlusCircle_bold'
                }
                label={
                  profilePhotoChild || companyData?.logo_url
                    ? 'Change Company Logo'
                    : 'Upload Company Logo'
                }
              />
              <input
                type="file"
                id="upload-logo"
                accept="image/*"
                className={`hidden absolute cursor-pointer`}
                onChange={(e: UploadEvent) => handleCompanyLogoUpload(e)}
              />
            </div>

            <div className="w-full">
              <div id="primaryInfo" className="flex flex-col gap-4">
                <TextInput
                  type="text"
                  fieldName="name"
                  placeholder="Company Name"
                  rules={{ required: 'name Title is required' }}
                />

                <div className="flex gap-x-4">
                  <Dropdown
                    fieldName="select_a_pathway"
                    placeholder="Select a Pathway"
                    options={[
                      'Conservation',
                      'Energy',
                      'Agriculture',
                      'Education',
                      'Construction',
                      'Finance',
                      'Forestry',
                      'Manufacturing',
                      'Arts & Culture',
                      'Real Estate',
                      'Medical',
                      'Policy',
                      'Research',
                      'Sports',
                      'Technology',
                      'Tourism',
                      'Transport',
                      'Urban Planning',
                      'Waste Management',
                      'Water',
                      'Media'
                    ]}
                    rules={{ required: 'Pathway is required' }}
                  />

                  <div className="flex items-center justify-between w-[40%]">
                    <Typography variant="caption-strong">
                      BIPOC Owned
                    </Typography>

                    <div className="-mr-4">
                      <Switch
                        id="is_bipoc_owned"
                        enabled={form.watch('is_bipoc_owned')}
                        onChange={e => form.setValue('is_bipoc_owned', e)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <Typography variant="caption-strong" className="mb-4">
                  More Info
                </Typography>

                <div className="flex gap-4">
                  <Dropdown
                    fieldName="type"
                    placeholder="Company Type"
                    options={[
                      'Corporation',
                      'Nonprofit Organization',
                      'Startup',
                      'Small Business',
                      'Government Agency',
                      'Educational Institution',
                      'Social Enterprise',
                      'Cooperative',
                      'Freelance/Independent Contractor',
                      'Partnership',
                      'Limited Liability Company (LLC)',
                      'Sole Proprietorship',
                      'Public Sector',
                      'Private Sector'
                    ]}
                  />

                  <Dropdown
                    fieldName="size"
                    placeholder="Company Size"
                    options={[
                      '1-10 Employees',
                      '11-50 Employees',
                      '51-200 Employees',
                      '201-500 Employees',
                      '501-1000 Employees',
                      '1001-5000 Employees',
                      '5001-10,000 Employees',
                      '10,001+ Employees'
                    ]}
                  />

                  <TextInput
                    type="text"
                    fieldName="no_of_employees"
                    placeholder="# of Employees"
                    rules={{ required: 'Number is required' }}
                  />
                </div>
              </div>

              <div id="companyLocation" className="flex flex-col gap-4 mt-4">
                <Typography variant="caption-strong" className="mb-4">
                  Company Location
                </Typography>

                <TextInput
                  type="text"
                  fieldName="location"
                  placeholder="Street Address"
                />

                <div className="flex gap-x-4">
                  <TextInput type="text" fieldName="city" placeholder="City" />

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

              <div id="compensationInfo" className="flex flex-col gap-4 mt-4">
                <Typography variant="caption-strong" className="mb-4">
                  Company Overview
                </Typography>

                <div className="flex gap-4">
                  <TextArea
                    fieldName="overview"
                    placeholder="Company Overview"
                  />
                </div>
              </div>

              <div id="benefits" className="flex flex-col gap-4 mt-4">
                <Typography variant="body-strong" className="mb-4">
                  Benefits
                </Typography>

                <div className="grid col-span-2 gap-x-8">
                  {benefitOptions.map(option => (
                    <div className="even:col-start-2" key={option.id}>
                      <Checkbox
                        id={option.id}
                        key={option.id}
                        label={option.label}
                        value={option.value}
                        nameCheckbox={option.nameCheckbox}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="tertiary"
              label="Save Changes"
              onClick={() => handleSubmit()}
            />
          </div>
        </form>
      </Form>
    </HydrationBoundary>
  );
};

export default CompanyProfile;
