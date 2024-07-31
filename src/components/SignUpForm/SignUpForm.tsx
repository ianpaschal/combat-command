import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '~/components/generic/Button';
import { Form } from '~/components/generic/Form';
import { FormTextField } from '~/components/generic/FormTextField';
import { useLinkedFormFields } from '~/hooks/useLinkedFormFields';
import { supabase } from '~/supabaseClient';

import './SignUpForm.scss';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  passwordRepeat: z.string(),
  username: z.string().min(3).max(24),
  givenName: z.string().min(2),
  surname: z.string().min(2),
}).superRefine((values, ctx) => {
  if (values.password !== values.passwordRepeat) {
    ctx.addIssue({
      message: 'Passwords must match!',
      code: z.ZodIssueCode.custom,
      path: ['passwordRepeat'],
    });
  }
});

type FormInput = z.infer<typeof formSchema>;

export const SignUpForm = (): JSX.Element => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordRepeat: '',
      username: '',
      givenName: '',
      surname: '',
    },
    mode: 'onBlur',
  });

  useLinkedFormFields(form, ['password', 'passwordRepeat']);

  const onSubmit: SubmitHandler<FormInput> = async (data: FormInput): Promise<void> => {
    const { email, password, ...restData } = data;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: restData,
      },
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
    <Form form={form} onSubmit={onSubmit} className="SignUpForm">

      <FormTextField name="email" label="Email" /> {/* No type to avoid built in validation */}
      <FormTextField name="password" label="Password" type="password" />
      <FormTextField name="passwordRepeat" label="Password (Repeat)" type="password" />
      <FormTextField name="username" label="Username" type="text" description='Your public &quot;nom de guerre&quot;.' />
      <FormTextField name="givenName" label="Given Name" type="text" description="Hidden, but required by some tournaments." />
      <FormTextField name="surname" label="Surname" type="text" description="Hidden, but required by some tournaments." />
      <Button type="submit" disabled={loading}>Register</Button>
    </Form>
  );
};