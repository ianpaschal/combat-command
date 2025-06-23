import { z } from 'zod';

export const forgotPasswordFormSchema = z.object({
  email: z.string().email().transform((val) => val.trim().toLowerCase()),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

export const defaultValues = {
  email: '',
};
