import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAuth } from '~/components/AuthProvider';
import { Form } from '~/components/generic/Form';
import { AppearanceFormData, appearanceFormSchema } from './AppearanceForm.schema';

import styles from './AppearanceForm.module.scss';

export const AppearanceForm = (): JSX.Element => {
  const user = useAuth();

  const form = useForm<AppearanceFormData>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      user_id: user!._id, // Page is wrapped in <RequireAuth/>
      language_code: 'en-US',
      use_dark_mode: false,
      color_scheme: 'default_light',
    },
  });

  const onSubmit: SubmitHandler<AppearanceFormData> = (_data) => {
    // TODO: Handle form submission
  };

  return (
    <Form className={styles.Form} form={form} onSubmit={onSubmit}>
      Coming soon...
    </Form>
  );
};
