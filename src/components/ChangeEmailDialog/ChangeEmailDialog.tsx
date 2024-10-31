import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { DialogProps, FormDialog } from '~/components/generic/Dialog';
import { FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { useUpdateEmail } from '~/hooks/services/auth/useUpdateEmail';

import styles from './ChangeEmailDialog.module.scss';

const changeEmailFormSchema = z.object({
  email: z.string().email(),
});

export type ChangeEmailFormInput = z.infer<typeof changeEmailFormSchema>;

export const ChangeEmailDialog = ({
  preventCancel,
  onOpenChange,
  open,
  ...props
}: DialogProps): JSX.Element => {
  const submitHook = useUpdateEmail();
  const form = useForm<ChangeEmailFormInput>({
    resolver: zodResolver(changeEmailFormSchema),
    defaultValues: {
      email: '',
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
      id="change-email-form"
      onOpenChange={handleOpenChange}
      open={open}
      preventCancel={preventCancel}
      submitHook={submitHook}
      submitLabel="Change Email"
      title="Change Email"
      width="small"
      {...props}
    >
      <FormField name="email" label="New Email">
        <InputText type="text" />
      </FormField>
    </FormDialog>
  );
};