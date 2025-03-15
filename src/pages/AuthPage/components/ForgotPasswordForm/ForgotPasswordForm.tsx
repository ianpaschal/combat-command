import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { useAuthFlow } from '~/pages/AuthPage/AuthPage.hooks';
import { useRequestPasswordReset } from '~/services/auth/useRequestPasswordReset';
import { PATHS } from '~/settings';
import {
  defaultValues,
  ForgotPasswordFormData,
  forgotPasswordFormSchema,
} from './ForgotPasswordForm.schema';

import styles from './ForgotPasswordForm.module.scss';

export const ForgotPasswordForm = (): JSX.Element => {
  const { setEmail } = useAuthFlow();
  const { requestPasswordReset, loading } = useRequestPasswordReset();
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });
  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data: ForgotPasswordFormData): Promise<void> => {
    setEmail(data.email);
    requestPasswordReset(data, PATHS.authResetPassword);
  };
  return (
    <Form className={styles.ForgotPasswordForm} form={form} onSubmit={onSubmit}>
      <div className={styles.ForgotPasswordForm__Header}>
        <h1>Forgot Password?</h1>
        <p>Get a reset code in your email</p>
      </div>
      <FormField name="email" label="Email" disabled={loading}>
        <InputText type="text" /* Not email, to avoid browser validation */ />
      </FormField>
      <Button type="submit" loading={loading}>Send Link</Button>
      <Separator />
      <p><Link to={PATHS.authSignUp}>Sign Up</Link> | <Link to={PATHS.authSignIn}>Sign In</Link></p>
    </Form>
  );
};
