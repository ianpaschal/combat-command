import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { supabase } from '~/supabaseClient';

import './SignInForm.scss';

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type FormInput = z.infer<typeof formSchema>;

export const SignInForm = (): JSX.Element => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data: FormInput): Promise<void> => {
    const { email, password } = data;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      // toast('Uh oh...', {
      //   description: (
      //     <p>{error.message}</p>
      //   ),
      // });
    } else {
      // toast('Signed In');
      navigate('/dashboard');
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="SignInForm">
      <FormField name="email" label="Email">
        <InputText type="text" /* Not email, to avoid browser validation */ />
      </FormField>
      <FormField name="password" label="Password">
        <InputText type="password" />
      </FormField>
      <p><Link to="/forgot-password">Forgot Password?</Link></p>
      <Button type="submit" disabled={loading}>Sign In</Button>
      {/* Add forgot password link */}
    </Form>
  );
};