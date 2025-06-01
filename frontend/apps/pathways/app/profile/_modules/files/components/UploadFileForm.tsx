import { Button } from '@workspace/ui/components/button';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';

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
import { Form } from '@workspace/ui/components/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Typography } from '@workspace/ui/components/typography';

import {
  dehydrate,
  useMutation,
  HydrationBoundary
} from '@tanstack/react-query';

import { fileSchema, FileSchema } from '../schema';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { Alert } from '@workspace/ui/components/alert/Alert';
import { PhosphorIcon } from '@workspace/ui/icons/PhosphorIcon';
import { CreateUploadFileRespnse, GetFilesResponse } from '../types';
import RowSpacer from '@/app/onboarding/_modules/components/RowSpacer';
import { createUploadFileUrl } from '../api/mutations/createUploadFileUrl';

type UploadFilesFormProps = {
  open?: boolean;
  isEditing?: boolean;
  trigger?: React.ReactNode;
  files?: GetFilesResponse[];
  onOpenChange?: (open: boolean) => void;
};

type UploadEvent = React.ChangeEvent<HTMLInputElement>;

const UploadFilesForm = ({
  open,
  files,
  trigger,
  onOpenChange,
  isEditing = false
}: UploadFilesFormProps) => {
  const [hasErrors, setHasErrors] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: createUploadFileUrl,
    onError: error => setHasErrors(true),
    onSuccess: () => {
      form.reset();
      onOpenChange?.(false);
      queryClient.invalidateQueries({ queryKey: ['file'] });
    }
  });

  const queryClient = getQueryClient();

  const form = useForm<FileSchema>({
    resolver: zodResolver(fileSchema),

    defaultValues: {
      resume: undefined,
      cover_letter: undefined
    },

    mode: 'onSubmit'
  });

  const resetAlerts = () => {
    setHasErrors(false);
  };

  const onSubmit = async (fileData: FileSchema) => {
    const isFormValid = await form.trigger();

    if (!isFormValid) {
      setHasErrors(true);
      return;
    }

    if (fileData?.resume && fileData?.resume?.length > 0) {
      const res = await mutation.mutateAsync({
        filename: 'resume',
        content_type: fileData?.resume[0]?.type
      });

      if (res.upload_url.fields) {
        console.log('res.upload_url.fields', res.upload_url);

        const formData = new FormData();

        for (const key in res.upload_url.fields) {
          formData.append(
            key,
            res.upload_url.fields[key as keyof typeof res.upload_url.fields]
          );
        }

        formData.append('file', fileData?.resume[0]);

        try {
          const fileUploadRes = await fetch(res.upload_url.url, {
            method: 'POST',
            body: formData
          });

          if (!fileUploadRes.ok) {
            throw new Error('Failed to upload file');
          }

          const fileUploadResData = await fileUploadRes.json();
          console.log('fileUploadResData', fileUploadResData);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }

    if (fileData?.cover_letter && fileData?.cover_letter?.length > 0) {
      const res = await mutation.mutateAsync({
        filename: 'cover_letter',
        content_type: fileData?.cover_letter[0]?.type
      });

      //        filename: fileData?.cover_letter[0]?.name,

      if (res.upload_url.fields) {
        console.log('res.upload_url.fields', res.upload_url);

        const formData = new FormData();

        for (const key in res.upload_url.fields) {
          formData.append(
            key,
            res.upload_url.fields[key as keyof typeof res.upload_url.fields]
          );
        }

        formData.append('file', fileData?.cover_letter[0]);

        try {
          const fileUploadRes = await fetch(res.upload_url.url, {
            method: 'POST',
            body: formData
          });

          if (!fileUploadRes.ok) throw new Error('Failed to upload file');

          const fileUploadResData = await fileUploadRes.json();
          console.log('fileUploadResData', fileUploadResData);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
    }

    console.log('formData', fileData);
  };

  const resume = form.watch('resume');
  const coverLetter = form.watch('cover_letter');

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name && form.formState.errors[name]) {
        setHasErrors(false);
        form.clearErrors(name);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

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
                Upload your files
              </Typography>
            </DialogTitle>

            <DialogDescription>
              <Typography variant="body" className="text-neutral-n-600">
                Add your resume and cover letter to your profile. Max File Size:
                1MB. File type: .PDF only.
              </Typography>
            </DialogDescription>

            {hasErrors && (
              <Alert
                variant="critical"
                onClose={() => setHasErrors(false)}
                label={'Please fix the errors below and try again'}
              />
            )}
          </DialogHeader>

          <Form {...form}>
            <form
              noValidate
              onSubmit={(event?: BaseSyntheticEvent) => event?.preventDefault()}
            >
              <div id="resumeUpload" className="flex flex-col mt-16">
                <Typography
                  variant="body-strong"
                  className="text-neutral-n-800"
                >
                  Resume
                </Typography>

                <RowSpacer />

                <div className="flex justify-between items-center gap-4">
                  {resume && resume.length > 0 ? (
                    <Typography variant="body" className="text-primary-g-600">
                      {resume[0].name}
                    </Typography>
                  ) : files && files.length > 0 ? (
                    <Typography variant="body" className="text-primary-g-600">
                      {files.find(
                        file => file.file_name === ('resume' as string)
                      )?.file_name ? (
                        files.find(
                          file => file.file_name === ('resume' as string)
                        )?.file_name + '.pdf'
                      ) : (
                        <Typography
                          variant="caption"
                          className="text-neutral-n-600"
                        >
                          None Uploaded
                        </Typography>
                      )}
                    </Typography>
                  ) : (
                    <Typography
                      variant="caption"
                      className="text-neutral-n-600"
                    >
                      None Uploaded
                    </Typography>
                  )}

                  <Button
                    type="button"
                    variant="secondary"
                    label="Upload File"
                    leftIcon={'UploadSimple_fill'}
                    onClick={() =>
                      document.getElementById('upload-resume')?.click()
                    }
                  />

                  <input
                    type="file"
                    accept=".pdf"
                    id="upload-resume"
                    className={`hidden absolute cursor-pointer`}
                    onChange={(e: UploadEvent) =>
                      form.setValue('resume', e?.target?.files ?? undefined)
                    }
                  />
                </div>

                {form.formState.errors.resume && (
                  <Typography variant="caption" className="text-red-500">
                    {form.formState.errors.resume.message}
                  </Typography>
                )}
              </div>

              <div id="coverLetterUpload" className="flex flex-col mt-16">
                <Typography
                  variant="body-strong"
                  className="text-neutral-n-800"
                >
                  Cover Letter
                </Typography>

                <RowSpacer />

                <div className="flex justify-between items-center gap-4">
                  {coverLetter && coverLetter.length > 0 ? (
                    <Typography variant="body" className="text-primary-g-600">
                      {coverLetter[0].name}
                    </Typography>
                  ) : files && files.length > 0 ? (
                    <Typography variant="body" className="text-primary-g-600">
                      {files?.find(
                        file => file?.file_name === ('cover_letter' as string)
                      )?.file_name ? (
                        files?.find(
                          file => file?.file_name === ('cover_letter' as string)
                        )?.file_name + '.pdf'
                      ) : (
                        <Typography
                          variant="caption"
                          className="text-neutral-n-600"
                        >
                          None Uploaded
                        </Typography>
                      )}
                    </Typography>
                  ) : (
                    <Typography
                      variant="caption"
                      className="text-neutral-n-600"
                    >
                      None Uploaded
                    </Typography>
                  )}

                  <Button
                    type="button"
                    variant="secondary"
                    label="Upload File"
                    leftIcon={'UploadSimple_fill'}
                    onClick={() =>
                      document.getElementById('upload-cover-letter')?.click()
                    }
                  />

                  <input
                    type="file"
                    accept=".pdf"
                    id="upload-cover-letter"
                    className={`hidden absolute cursor-pointer`}
                    onChange={(e: UploadEvent) =>
                      form.setValue(
                        'cover_letter',
                        e?.target?.files ?? undefined
                      )
                    }
                  />
                </div>

                {form.formState.errors.cover_letter && (
                  <Typography variant="caption" className="text-red-500">
                    {form.formState.errors.cover_letter.message}
                  </Typography>
                )}
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
              label="Save to Profile"
              onClick={() => onSubmit(form.getValues())}
              disabled={
                !(resume && resume?.length > 0) &&
                !(coverLetter && coverLetter?.length > 0)
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HydrationBoundary>
  );
};

export default UploadFilesForm;
