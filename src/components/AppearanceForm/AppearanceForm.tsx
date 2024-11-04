import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '~/components/AuthProvider';
import { Form } from '~/components/generic/Form';
import { UserPreferences, userPreferencesSchema } from '~/types/UserPreferences';

import styles from './AppearanceForm.module.scss';

export const AppearanceForm = (): JSX.Element => {
  const { user } = useAuth();

  const form = useForm<UserPreferences>({
    resolver: zodResolver(userPreferencesSchema),
    defaultValues: {
      user_id: user!.id, // Page is wrapped in <RequireAuth/>
      language_code: 'en-US',
      color_scheme: 'default_light',
    },
  });

  const onSubmit: SubmitHandler<UserPreferences> = (data) => {
    console.log(data);
  };

  return (
    <Form className={styles.Form} form={form} onSubmit={onSubmit}>
      Coming soon...
    </Form>
  );
};