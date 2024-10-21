import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useAuth } from '~/components/AuthProvider';
import { ChangePasswordForm } from '~/components/ChangePasswordForm/';
import { Button } from '~/components/generic/Button';
import { Dialog } from '~/components/generic/Dialog';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
import { supabase } from '~/supabaseClient';

import styles from './AccountForm.module.scss';

const formSchema = z.object({
  password: z.string().min(8),
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

type PasswordChangeSchema = z.infer<typeof formSchema>;

export const AccountForm = (): JSX.Element => {
  const user = useAuth();

  const form = useForm<PasswordChangeSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      password_repeat: '',
    },
    mode: 'onBlur',
  });
  const onSubmit: SubmitHandler<PasswordChangeSchema> = async ({ password }): Promise<void> => {
    // Update on supabase
    await supabase.auth.updateUser({ password });
  };

  return (
    <div className={styles.Root}>
      <Label>Email</Label>
      {user?.email}
      <Button muted>Change Email</Button>
      <Separator />
      <ChangePasswordForm />
      <Separator />
      <Button intent="danger" muted>Delete Account</Button>
    </div >
  );
};