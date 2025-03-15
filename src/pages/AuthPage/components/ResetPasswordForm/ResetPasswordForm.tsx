import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { useAuthFlow } from '~/pages/AuthPage/AuthPage.hooks';
import { useResetPassword } from '~/services/auth/useResetPassword';
import { PATHS } from '~/settings';
import {
  defaultValues,
  ResetPasswordFormData,
  resetPasswordFormSchema,
} from './ResetPasswordForm.schema';

import styles from './ResetPasswordForm.module.scss';

export const ResetPasswordForm = (): JSX.Element => {
  const { email } = useAuthFlow();
  const { resetPassword, loading } = useResetPassword();
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues,
    mode: 'onSubmit',
  });
  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (data: ResetPasswordFormData): Promise<void> => {
    resetPassword({ ...data, email }, PATHS.dashboard);
  };
  return (
    <Form className={styles.ResetPasswordForm} form={form} onSubmit={onSubmit}>
      <div className={styles.ResetPasswordForm__Header}>
        <h1>Reset Password</h1>
        <p>Enter your reset code and a new password</p>
      </div>
      <FormField name="code" label="Code" disabled={loading}>
        <InputText type="text" />
      </FormField>
      <FormField name="newPassword" label="Password" disabled={loading}>
        <InputText type="password" />
      </FormField>
      <FormField name="newPasswordRepeat" label="Password (Repeat)" disabled={loading}>
        <InputText type="password" />
      </FormField>
      <Button type="submit" loading={loading}>Reset Password</Button>
      <Separator />
      <p><Link to={PATHS.authSignUp}>Sign Up</Link> | <Link to={PATHS.authSignIn}>Sign In</Link></p>
    </Form>
  );
};
