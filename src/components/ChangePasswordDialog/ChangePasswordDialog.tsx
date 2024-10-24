import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Dialog, DialogProps } from '~/components/generic/Dialog';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { useUpdatePassword } from '~/hooks/services/auth/useUpdatePassword';
import { passwordValidator } from '~/utils/passwordValidator';

import styles from './ChangePasswordDialog.module.scss';

const changePasswordFormSchema = z.object({
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  password_repeat: z.string(),
}).superRefine(passwordValidator);

type ChangePasswordForm = z.infer<typeof changePasswordFormSchema>;

export const ChangePasswordDialog = ({
  preventCancel,
  onOpenChange,
  open,
  ...props
}: DialogProps): JSX.Element => {
  const updatePassword = useUpdatePassword();
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      password: '',
      password_repeat: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<ChangePasswordForm> = async ({ password }): Promise<void> => {
    updatePassword.mutate({ password }, {
      onSuccess: () => {
        if (onOpenChange) {
          onOpenChange(false);
        }
      },
    });
  };

  const actions = [];
  if (!preventCancel) {
    actions.push({ label: 'Cancel', muted: true, cancel: true, disabled: updatePassword.isPending });
  }
  actions.push({ label: 'Change Password', form: 'change-password-form', type: 'submit' as const, disabled: updatePassword.isPending });

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    // TODO: Implement later...
    // if (form.formState.isDirty) {
    //   setUnsavedChangesDialogOpen(true);
    // }
    if (open) {
      form.reset();
    }
  };

  return (
    <Dialog
      title="Change Password"
      width="small"
      open={open}
      onOpenChange={handleOpenChange}
      preventCancel={preventCancel}
      actions={actions}
      {...props}
    >
      <Form id="change-password-form" className={styles.Form} form={form} onSubmit={onSubmit}>
        <FormField name="password" label="New Password">
          <InputText type="password" />
        </FormField>
        <FormField name="password_repeat" label="New Password (Repeat)">
          <InputText type="password" />
        </FormField>
      </Form>
    </Dialog>
  );
};