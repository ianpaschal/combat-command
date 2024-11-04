import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { DialogProps, FormDialog } from '~/components/generic/Dialog';
import { FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { useUpdatePassword } from '~/services/auth/useUpdatePassword';
import { passwordValidator } from '~/utils/passwordValidator';

import styles from './ChangePasswordDialog.module.scss';

const changePasswordFormSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  password_repeat: z.string(),
}).superRefine(passwordValidator);

export type ChangePasswordFormInput = z.infer<typeof changePasswordFormSchema>;

export const ChangePasswordDialog = ({
  preventCancel,
  onOpenChange,
  open,
  ...props
}: DialogProps): JSX.Element => {
  const submitHook = useUpdatePassword();
  const form = useForm<ChangePasswordFormInput>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      password: '',
      password_repeat: '',
    },
    mode: 'onSubmit',
  });

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <FormDialog
      classNames={{ form: styles.Form }}
      form={form}
      id="change-password-form"
      onOpenChange={handleOpenChange}
      open={open}
      preventCancel={preventCancel}
      submitHook={submitHook}
      submitLabel="Change Password"
      title="Change Password"
      width="small"
      {...props}
    >
      <FormField name="password" label="New Password">
        <InputText type="password" />
      </FormField>
      <FormField name="password_repeat" label="New Password (Repeat)">
        <InputText type="password" />
      </FormField>
    </FormDialog>
  );
};