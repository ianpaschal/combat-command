import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { supabase } from '~/supabaseClient';

import styles from './ChangePasswordForm.module.scss';

const changePasswordFormSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  password_repeat: z.string(),
}).superRefine((values, ctx) => {
  if (values.password !== values.password_repeat) {
    ctx.addIssue({
      message: 'Passwords must match!',
      code: z.ZodIssueCode.custom,
      path: ['passwordRepeat'],
    });
  }
});

type ChangePasswordForm = z.infer<typeof changePasswordFormSchema>;

interface ChangePasswordFormProps {
  id?: string;
}

export const ChangePasswordForm = ({
  id = 'change-password-form',
}: ChangePasswordFormProps): JSX.Element => {
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      password: '',
      password_repeat: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<ChangePasswordForm> = async ({ password }): Promise<void> => {
    // Update on supabase
    await supabase.auth.updateUser({ password });
  };

  return (
    <Form id={id} className={styles.Form} form={form} onSubmit={onSubmit}>
      <FormField name="password" label="New Password">
        <InputText type="password" />
      </FormField>
      <FormField name="password_repeat" label="New Password (Repeat)">
        <InputText type="password" />
      </FormField>
      <Button className={styles.Submit} type="submit" muted>Change Password</Button>
    </Form>
  );
};