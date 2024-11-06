import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { PageWrapperHalf } from '~/components/PageWrapperHalf';
import { PreventAuth } from '~/components/PreventAuth';
import { useResetPassword } from '~/services/auth/useResetPassword';

import styles from './ForgotPasswordPage.module.scss';

const forgotPasswordFormSchema = z.object({
  email: z.string().min(1, 'Please enter your email.'),
});

export type ForgotPasswordFormInput = z.infer<typeof forgotPasswordFormSchema>;

export const ForgotPasswordPage = (): JSX.Element => {

  const resetPassword = useResetPassword();

  const form = useForm<ForgotPasswordFormInput>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormInput> = async (data: ForgotPasswordFormInput): Promise<void> => {
    resetPassword.mutate(data);
  };

  const { isPending } = resetPassword;

  return (
    <PreventAuth>
      <PageWrapperHalf>
        <div>
          <h1>Forgot Password?</h1>
          <p>Get a reset link in your email</p>
        </div>
        <Form className={styles.Form} form={form} onSubmit={onSubmit}>
          <FormField name="email" label="Email" disabled={isPending}>
            <InputText type="text" /* Not email, to avoid browser validation */ />
          </FormField>
          <Button type="submit" loading={isPending}>Send Link</Button>
        </Form>
        <Separator />
        <p><Link to="/sign-up">Sign Up</Link> | <Link to="/sign-up">Sign In</Link></p>
      </PageWrapperHalf>
    </PreventAuth>
  );
};
