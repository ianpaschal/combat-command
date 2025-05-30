import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { useSignUp } from '~/services/auth/useSignUp';
import { PATHS } from '~/settings';

import {
  defaultValues,
  SignUpFormData,
  signUpFormSchema,
} from './SignUpForm.schema';

import styles from './SignUpForm.module.scss';

export const SignUpForm = (): JSX.Element => {
  const { signUp, loading } = useSignUp();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (data: SignUpFormData): Promise<void> => {
    signUp(data, PATHS.dashboard);
  };

  return (
    <Form className={styles.SignUpForm} id="sign-up-form" form={form} onSubmit={onSubmit}>
      <div className={styles.SignUpForm__Header}>
        <h1>Get Started</h1>
        <p>Create a new account</p>
      </div>
      <FormField name="username" label="Username" description="Your public display name" disabled={loading}>
        <InputText type="text" />
      </FormField>
      <Separator />
      <FormField name="givenName" label="Given Name" description="Hidden by default" disabled={loading}>
        <InputText type="text" />
      </FormField>
      <FormField name="familyName" label="Family Name" description="Hidden by default" disabled={loading}>
        <InputText type="text" />
      </FormField>
      <Separator />
      <FormField name="email" label="Email" disabled={loading}>
        <InputText type="text" /* Not email, to avoid browser validation */ />
      </FormField>
      <FormField name="password" label="Password" disabled={loading}>
        <InputText type="password" />
      </FormField>
      <FormField name="passwordRepeat" label="Password (Repeat)" disabled={loading}>
        <InputText type="password" />
      </FormField>
      <Button type="submit" loading={loading}>Sign Up</Button>
      <Separator />
      <p>Already have an account? <Link to={PATHS.authSignIn}>Sign In</Link></p>
    </Form>
  );
};
