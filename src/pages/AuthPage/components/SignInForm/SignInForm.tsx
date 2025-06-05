import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { useSignIn } from '~/services/auth/useSignIn';
import { PATHS } from '~/settings';
import {
  defaultValues,
  SignInFormData,
  signInFormSchema,
} from './SignInForm.schema';

import styles from './SignInForm.module.scss';

export const SignInForm = (): JSX.Element => {
  const { signIn, loading } = useSignIn();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<SignInFormData> = async (data: SignInFormData): Promise<void> => {
    signIn(data, PATHS.dashboard);
  };

  return (
    <Form className={styles.SignInForm} form={form} onSubmit={onSubmit}>
      <div className={styles.SignInForm__Header}>
        <h1>Welcome Back</h1>
        <p>Sign in to your account</p>
      </div>
      <FormField name="email" label="Email" disabled={loading}>
        <InputText type="text" /* Not email, to avoid browser validation */ />
      </FormField>
      <FormField name="password" label="Password" disabled={loading}>
        <InputText type="password" />
      </FormField>
      <Link to={PATHS.authForgotPassword}>Forgot Password</Link>
      <Button type="submit" loading={loading}>Sign In</Button>
      <Separator />
      <p>Don't have an account yet? <Link to={PATHS.authSignUp}>Sign Up</Link></p>
    </Form>
  );
};
