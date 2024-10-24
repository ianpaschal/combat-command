import { z } from 'zod';

type FormData = {
  password: string;
  password_repeat: string;
};

export const passwordValidator = ({
  password,
  password_repeat,
}: FormData, ctx: z.RefinementCtx): void => {
  if (password !== password_repeat) {
    ctx.addIssue({
      message: 'Passwords do not match.',
      code: z.ZodIssueCode.custom,
      path: ['passwordRepeat'],
    });
  }

  // 1. Lowercase check
  if (!/[a-z]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one lowercase letter.',
      path: ['password'],
    });
  }

  // 2. Uppercase check
  if (!/[A-Z]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one uppercase letter.',
      path: ['password'],
    });
  }

  // 3. Digit (number) check
  if (!/\d/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one digit.',
      path: ['password'],
    });
  }

  // 4. Special character check
  if (!/[!@#$%^&*]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Password must contain at least one special character (!@#$%^&*).',
      path: ['password'],
    });
  }
};