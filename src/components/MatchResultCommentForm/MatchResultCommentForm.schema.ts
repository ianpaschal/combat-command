import { z } from 'zod';

export const matchResultCommentFormSchema = z.object({
  body: z.string().min(1),
});

export type MatchResultCommentFormData = z.infer<typeof matchResultCommentFormSchema>;

export const defaultValues: MatchResultCommentFormData = {
  body: '',
};
