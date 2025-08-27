import { SubmitHandler, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '~/components/generic/Button';
import { CardHeader } from '~/components/generic/Card';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { PreventAuth } from '~/components/PreventAuth';
import { toast } from '~/components/ToastProvider';
import {
  ClaimUserFormData,
  claimUserFormSchema,
  defaultValues,
} from '~/pages/ClaimUserPage/ClaimUserPage.schema';
import { useSignIn } from '~/services/auth/useSignIn';
import { useClaimUser } from '~/services/users';
import { PATHS } from '~/settings';

import styles from './ClaimUserPage.module.scss';

export const ClaimUserPage = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const claimToken = searchParams.get('claimToken');
  const email = searchParams.get('email') ?? '';

  const { action: claimUser, loading: claimUserLoading } = useClaimUser({
    successMessage: 'Successfully claimed account! Signing in...',
    onSuccess: () => {
      if (email) {
        signIn({
          email,
          password: form.watch('password'),
        }, PATHS.dashboard);
      }
    },
  });
  const { signIn, loading: signInLoading } = useSignIn();
  const form = useForm<ClaimUserFormData>({
    resolver: zodResolver(claimUserFormSchema),
    defaultValues: {
      ...defaultValues,
      email,
    },
    mode: 'onSubmit',
  });
  const onSubmit: SubmitHandler<ClaimUserFormData> = async ({ password }: ClaimUserFormData): Promise<void> => {
    if (!claimToken) {
      return toast.error('Missing claim token in URL.');
    }
    claimUser({
      claimToken,
      password,
    });
  };
  const loading = claimUserLoading || signInLoading;
  return (
    <PreventAuth>
      <div className={styles.ClaimUserPage}>
        <div className={styles.ClaimUserPage_Card}>
          <CardHeader title="Claim Account" />
          <Form
            className={styles.ClaimUserPage_Form}
            form={form}
            disabled={loading}
            onSubmit={onSubmit}
          >
            <p>Please set a password to complete the process and sign in.</p>
            <FormField name="email" label="Email" disabled>
              <InputText type="email" />
            </FormField>
            <FormField name="password" label="Password">
              <InputText type="password" />
            </FormField>
            <FormField name="passwordRepeat" label="Password (Repeat)">
              <InputText type="password" />
            </FormField>
            <div className={styles.ClaimUserPage_Footer}>
              <Button type="submit" loading={loading}>
                Complete
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </PreventAuth>
  );
};
