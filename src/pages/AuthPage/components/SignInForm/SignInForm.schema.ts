import { z } from 'zod';

export const signInFormSchema = z.object({
  email: z.string().min(1, 'Please enter your email.'),
  password: z.string().min(1, 'Please enter your password.'),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;

export const defaultValues = {
  email: '',
  password: '',
};
