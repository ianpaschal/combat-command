import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '~/components/generic/Button';
import { Form } from '~/components/generic/Form';
import { FormTextField } from '~/components/generic/FormTextField';
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
      <FormTextField name="email" label="Email" /> {/* No type to avoid built in validation */}
      <FormTextField name="password" label="Password" type="password" />
      <Button type="submit" disabled={loading}>Sign In</Button>
      {/* Add forgot password link */}
    </Form>
  );
};