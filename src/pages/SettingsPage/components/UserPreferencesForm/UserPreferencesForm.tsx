import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { themeOptions } from '~/api';
import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { toast } from '~/components/ToastProvider';
import { useGetUserPreferences, useSetUserPreferences } from '~/services/userPreferences';
import {
  defaultValues,
  UserPreferencesFormData,
  userPreferencesFormSchema,
} from './UserPreferencesForm.schema';

import styles from './UserPreferencesForm.module.scss';

export const UserPreferencesForm = (): JSX.Element => {
  const {
    data: userPreferences,
    loading: userPreferencesLoading,
  } = useGetUserPreferences({});
  const {
    mutation: setUserPreferences,
    loading: setUserPreferencesLoading,
  } = useSetUserPreferences({
    onSuccess: (): void => {
      toast.success('Preferences saved!');
    },
  });
  const form = useForm<UserPreferencesFormData>({
    resolver: zodResolver(userPreferencesFormSchema),
    defaultValues: {
      ...defaultValues,
      ...userPreferences,
    },
  });
  const onSubmit: SubmitHandler<UserPreferencesFormData> = (data) => {
    setUserPreferences(data);
  };
  const loading = userPreferencesLoading || setUserPreferencesLoading;
  return (
    <Form form={form} onSubmit={onSubmit} className={styles.Form}>
      <FormField name="theme" label="Theme" >
        <InputSelect options={themeOptions} />
      </FormField>
      <Button className={styles.SubmitButton} type="submit" disabled={loading}>
        Save
      </Button>
    </Form>
  );
};
