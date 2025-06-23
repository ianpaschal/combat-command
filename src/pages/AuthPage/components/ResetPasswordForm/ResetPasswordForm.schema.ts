import { z } from 'zod';

export const resetPasswordFormSchema = z.object({
  code: z.string().min(1).max(8).transform((val) => val.trim()),
  email: z.string().email().transform((val) => val.trim().toLowerCase()),
  newPassword: z.string().min(8, 'Password must be at least 8 characters.').transform((val) => val.trim()),
  newPasswordRepeat: z.string().transform((val) => val.trim()),
}).superRefine((values, ctx) => {
  if (values.newPassword !== values.newPasswordRepeat) {
    ctx.addIssue({
      message: 'Passwords must match!',
      code: z.ZodIssueCode.custom,
      path: ['newPasswordRepeat'],
    });
  }
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

export const defaultValues = {
  code: '',
  email: '',
  newPassword: '',
  newPasswordRepeat: '',
};
