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
import { useSignIn } from '~/services/auth/useSignIn';

import styles from './SignInPage.module.scss';

const signInFormSchema = z.object({
  email: z.string().min(1, 'Please enter your email.'),
  password: z.string().min(1, 'Please enter your password.'),
});

export type SignInFormInput = z.infer<typeof signInFormSchema>;

export const SignInPage = (): JSX.Element => {
  const signUp = useSignIn();

  const form = useForm<SignInFormInput>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<SignInFormInput> = async (data: SignInFormInput): Promise<void> => {
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
        <h1>Welcome Back</h1>
        <p>Sign in to your account</p>
      </div>
      <Form className={styles.Form} form={form} onSubmit={onSubmit}>
        <FormField name="email" label="Email" disabled={isPending}>
          <InputText type="text" /* Not email, to avoid browser validation */ />
        </FormField>
        <FormField name="password" label="Password" disabled={isPending}>
          <InputText type="password" />
        </FormField>
        <Link to="/forgot-password">Forgot Password</Link>
        <Button type="submit" loading={isPending}>Sign In</Button>
      </Form>
      <Separator />
      <p>Don't have an account yet? <Link to="/sign-up">Sign Up</Link></p>
    </PageWrapperHalf>
  );
};
