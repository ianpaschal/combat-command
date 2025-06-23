import { z } from 'zod';

export const signInFormSchema = z.object({
  email: z.string().min(1, 'Please enter your email.').transform((val) => val.trim().toLowerCase()),
  password: z.string().min(1, 'Please enter your password.').transform((val) => val.trim()),
});

export type SignInFormData = z.infer<typeof signInFormSchema>;

export const defaultValues = {
  email: '',
  password: '',
};
