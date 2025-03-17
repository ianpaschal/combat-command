import { z } from 'zod';

const fileSizeLimitMb = 5;
const fileSizeLimit = fileSizeLimitMb * 1024 * 1024;

export const matchResultPhotoUploadFormSchema = z.object({
  files: z.array(z.instanceof(File))
    .refine((list) => list.length > 0, 'No files selected')
    .refine((list) => list.length <= 20, 'Maximum 20 files allowed')
    .transform((list) => Array.from(list))
    .refine(
      (files) => {
        const allowedTypes: { [key: string]: boolean } = {
          'image/jpeg': true,
          'image/png': true,
        };
        return files.every((file) => allowedTypes[file.type]);
      },
      { message: 'Invalid file type. Allowed types are JPG or PNG.' },
    )
    .refine(
      (files) => files.every((file) => file.size <= fileSizeLimit),
      {
        message: `File size should not exceed ${fileSizeLimitMb} MB.`,
      },
    ),
});

export type MatchResultPhotoUploadFormData = z.infer<typeof matchResultPhotoUploadFormSchema>;

export const defaultValues: MatchResultPhotoUploadFormData = {
  files: [],
};
