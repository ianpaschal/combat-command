import { SubmitHandler, useForm } from 'react-hook-form';
import clsx from 'clsx';

import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import {
  createSchema,
  getDefaultValues,
  UserFormData,
  UserSubmitData,
} from '~/components/UserSelectDialog/components/UserForm/UserForm.schema';
import { validateForm } from '~/utils/validateForm';

import styles from './UserForm.module.scss';

export interface UserFormProps {
  className?: string;
  id: string;
  disabled?: boolean;
  onSubmit: (data: UserSubmitData) => void;
  loading?: boolean;
}

export const UserForm = ({
  className,
  id,
  disabled = false,
  onSubmit,
  // loading = false,
}: UserFormProps): JSX.Element => {
  const formSchema = createSchema();
  const form = useForm<UserFormData>({
    defaultValues: getDefaultValues(),
    mode: 'onSubmit',
  });

  const handleSubmit: SubmitHandler<UserFormData> = async ({ ...formData }): Promise<void> => {
    const data = validateForm(formSchema, formData, form.setError);
    if (data) {
      onSubmit(data);
    }
  };

  return (
    <Form
      id={id}
      form={form}
      className={clsx(styles.UserForm, className)}
      onSubmit={handleSubmit}
      disabled={disabled}
    >
      <FormField className={styles.UserForm_EmailField} name="email" label="Email">
        <InputText />
      </FormField>
      <FormField className={styles.UserForm_GivenNameField} name="givenName" label="First Name">
        <InputText />
      </FormField>
      <FormField className={styles.UserForm_FamilyNameField} name="familyName" label="Last Name">
        <InputText />
      </FormField>
    </Form>
  );
};
