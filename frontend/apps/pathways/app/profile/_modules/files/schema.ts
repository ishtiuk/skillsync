import { z } from 'zod';

export const fileSchema = z.object({
  resume: z
    .custom<FileList | undefined>(
      value => value instanceof FileList || value === undefined
    )
    .refine(files => !files || files.length === 1, {
      message: 'Only one file can be uploaded at a time'
    })
    .refine(files => !files || files[0].type === 'application/pdf', {
      message: 'File must be a PDF'
    })
    .refine(files => !files || files[0].size < 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB'
    })
    .optional(),

  cover_letter: z
    .custom<FileList | undefined>(
      value => value instanceof FileList || value === undefined
    )
    .refine(files => !files || files.length === 1, {
      message: 'Only one file can be uploaded at a time'
    })
    .refine(files => !files || files[0].type === 'application/pdf', {
      message: 'File must be a PDF'
    })
    .refine(files => !files || files[0].size < 5 * 1024 * 1024, {
      message: 'File size must be less than 5MB'
    })
    .optional()
});

export type FileSchema = z.infer<typeof fileSchema>;
