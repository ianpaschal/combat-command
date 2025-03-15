import { z } from 'zod';

export const forgotPasswordFormSchema = z.object({
  email: z.string().min(1, 'Please enter your email.'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;

export const defaultValues = {
  email: '',
};
