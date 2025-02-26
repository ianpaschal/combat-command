import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { PageWrapperHalf } from '~/components/PageWrapperHalf';
import { PreventAuth } from '~/components/PreventAuth';
import { useSignIn } from '~/services/auth/useSignIn';

import styles from './SignInPage.module.scss';

const signInFormSchema = z.object({
  email: z.string().min(1, 'Please enter your email.'),
  password: z.string().min(1, 'Please enter your password.'),
});

export type SignInFormInput = z.infer<typeof signInFormSchema>;

export const SignInPage = (): JSX.Element => {
  const { signIn, isLoading } = useSignIn();

  const form = useForm<SignInFormInput>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit: SubmitHandler<SignInFormInput> = async (data: SignInFormInput): Promise<void> => {
    signIn(data, '/dashboard');
  };

  return (
    <PreventAuth>
      <PageWrapperHalf>
        <div>
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>
        <Form className={styles.Form} form={form} onSubmit={onSubmit}>
          <FormField name="email" label="Email" disabled={isLoading}>
            <InputText type="text" /* Not email, to avoid browser validation */ />
          </FormField>
          <FormField name="password" label="Password" disabled={isLoading}>
            <InputText type="password" />
          </FormField>
          <Link to="/forgot-password">Forgot Password</Link>
          <Button type="submit" loading={isLoading}>Sign In</Button>
        </Form>
        <Separator />
        <p>Don't have an account yet? <Link to="/sign-up">Sign Up</Link></p>
      </PageWrapperHalf>
    </PreventAuth>
  );
};
