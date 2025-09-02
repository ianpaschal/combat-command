import { z } from 'zod';

export const claimUserFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.').transform((val) => val.trim()),
  passwordRepeat: z.string().transform((val) => val.trim()),
}).superRefine((values, ctx) => {
  if (values.password !== values.passwordRepeat) {
    ctx.addIssue({
      message: 'Passwords must match!',
      code: z.ZodIssueCode.custom,
      path: ['passwordRepeat'],
    });
  }
});

export type ClaimUserFormData = z.infer<typeof claimUserFormSchema>;

export const defaultValues = {
  email: '',
  password: '',
  passwordRepeat: '',
};
