import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { PageWrapperHalf } from '~/components/PageWrapperHalf';
import { useSignUp } from '~/services/auth/useSignUp';

import styles from './SignUpPage.module.scss';

const signUpFormSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  passwordRepeat: z.string(),
  username: z.string().min(3, 'Must be at least 3 characters.').max(24, 'Cannot be longer than 24 characters.'),
  given_name: z.string().min(2, 'Must be at least 2 characters.').max(64, 'Cannot be longer than 64 characters.'),
  family_name: z.string().min(2, 'Must be at least 2 characters.').max(64, 'Cannot be longer than 64 characters.'),
}).superRefine((values, ctx) => {
  if (values.password !== values.passwordRepeat) {
    ctx.addIssue({
      message: 'Passwords must match!',
      code: z.ZodIssueCode.custom,
      path: ['passwordRepeat'],
    });
  }
});

export type SignUpFormInput = z.infer<typeof signUpFormSchema>;

export const SignUpPage = (): JSX.Element => {
  const signUp = useSignUp();

  const form = useForm<SignUpFormInput>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      given_name: '',
      family_name: '',
      passwordRepeat: '',
      username: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<SignUpFormInput> = async (data: SignUpFormInput): Promise<void> => {
    signUp.mutate(data);
  };

  // If logged in, redirect to dashboard
  if (useAuth()) {
    return <Navigate to="/dashboard" />;
  }
  const { isPending } = signUp;
  return (
    <PageWrapperHalf>
      <div>
        <h1>Get Started</h1>
        <p>Create a new account</p>
      </div>
      <Form className={styles.Form} id="sign-up-form" form={form} onSubmit={onSubmit}>
        <FormField name="username" label="Username" description="Your public display name" disabled={isPending}>
          <InputText type="text" />
        </FormField>
        <Separator />
        <FormField name="given_name" label="Given Name" description="Hidden by default" disabled={isPending}>
          <InputText type="text" />
        </FormField>
        <FormField name="family_name" label="Family Name" description="Hidden by default" disabled={isPending}>
          <InputText type="text" />
        </FormField>
        <Separator />
        <FormField name="email" label="Email" disabled={isPending}>
          <InputText type="text" /* Not email, to avoid browser validation */ />
        </FormField>
        <FormField name="password" label="Password" disabled={isPending}>
          <InputText type="password" />
        </FormField>
        <FormField name="passwordRepeat" label="Password (Repeat)" disabled={isPending}>
          <InputText type="password" />
        </FormField>
        <Button type="submit" loading={isPending}>Sign Up</Button>
      </Form>
      <Separator />
      <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
    </PageWrapperHalf>
  );
};
