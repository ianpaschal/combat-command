import { z } from 'zod';

export const signUpFormSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  passwordRepeat: z.string(),
  username: z.string().min(3, 'Must be at least 3 characters.').max(24, 'Cannot be longer than 24 characters.'),
  givenName: z.string().min(2, 'Must be at least 2 characters.').max(64, 'Cannot be longer than 64 characters.'),
  familyName: z.string().min(2, 'Must be at least 2 characters.').max(64, 'Cannot be longer than 64 characters.'),
}).superRefine((values, ctx) => {
  if (values.password !== values.passwordRepeat) {
    ctx.addIssue({
      message: 'Passwords must match!',
      code: z.ZodIssueCode.custom,
      path: ['passwordRepeat'],
    });
  }
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

export const defaultValues ={
  email: '',
  password: '',
  givenName: '',
  familyName: '',
  passwordRepeat: '',
  username: '',
};
