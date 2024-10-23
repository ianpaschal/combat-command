import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, Navigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { PageWrapperHalf } from '~/components/PageWrapperHalf';
import { useUpdatePassword } from '~/hooks/services/auth/useUpdatePassword';
import { supabase } from '~/supabaseClient';

import styles from './UpdatePasswordPage.module.scss';

const updatePasswordFormSchema = z.object({
  password: z.string().min(8, 'Please enter your new password.'),
});

export type UpdatePasswordFormInput = z.infer<typeof updatePasswordFormSchema>;

export const UpdatePasswordPage = (): JSX.Element => {
  const updatePassword = useUpdatePassword();

  const form = useForm<UpdatePasswordFormInput>({
    resolver: zodResolver(updatePasswordFormSchema),
    defaultValues: {
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<UpdatePasswordFormInput> = async (data: UpdatePasswordFormInput): Promise<void> => {
    updatePassword.mutate(data);
  };

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (e) => {
      if (e === 'PASSWORD_RECOVERY') {
        const newPassword = prompt('What would you like your new password to be?');
        if (newPassword) {
          const { data, error } = await supabase.auth
            .updateUser({ password: newPassword });

          if (data) alert('Password updated successfully!');
          if (error) alert('There was an error updating your password.');
        }
      }
    });
  }, []);

  // If logged in, redirect to dashboard
  if (useAuth()) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <PageWrapperHalf>
      <div>
        <h1>Welcome Back</h1>
        <p>Update your password</p>
      </div>
      <Form className={styles.Form} form={form} onSubmit={onSubmit}>
        <FormField name="password" label="Password">
          <InputText type="password" />
        </FormField>
        <Link to="/forgot-password">Update Password</Link>
        <Button type="submit" disabled={updatePassword.isPending}>Update</Button>
      </Form>
    </PageWrapperHalf>
  );
};
