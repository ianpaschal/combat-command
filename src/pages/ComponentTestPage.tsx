import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
import { z } from 'zod';

import { Button } from '~/components/generic/Button/Button';
import { Card } from '~/components/generic/Card';
import { Form } from '~/components/generic/Form';
import { FormSelectField } from '~/components/generic/FormSelectField';
import { FormTextField } from '~/components/generic/FormTextField/FormTextField';
import { InputDate } from '~/components/generic/InputDate';
import { InputSelectItem } from '~/components/generic/InputSelect/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { UserPortrait } from '~/components/UserPortrait';

import './ComponentTestPage.scss';

const formSchema = z.object({
  email: z.string().min(5, {
    message: 'Email must be at least 5 characters.',
  }),
  username: z.string().min(20, {
    message: 'Username must be at least 20 characters.',
  }),
});

type FormInput = z.infer<typeof formSchema>;

export const ComponentTestPage = (): JSX.Element => {
  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
    },
  });

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
  };

  const options: InputSelectItem[] = [
    {
      label: 'Test 1',
      options: [
        { value: 'foo', label: 'Foo' },
        { value: 'bar', label: 'Bar' },
      ],
    },
    '-' as const,
    { value: 'qux', label: 'Qux' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '5rem 0.5rem' }}>
      <Card>
        <Button slotBefore={<Camera />}>Test</Button>
        <Button slotBefore={<Camera />} variant="solid-muted">Test</Button>
        <Button slotAfter={<Camera />} variant="outlined">Test</Button>
        <Button slotAfter={<Camera />} variant="outlined-muted">Test</Button>
        <Button slotAfter={<Camera />} variant="ghost">Test</Button>
      </Card>

      <Card>
        Hello world
        <UserPortrait username="FooBar" givenName="Ian" familyName="Paschal" orientation="horizontal" />
      </Card>

      {/* <InputSelect options={}/> */}
      {/* <InputCheckbox options={}/> */}

      {/* LOW PRIORITY */}
      {/* <InputFile */}
      {/* <InputTextArea */}

      <Card>
        <InputText />
        <InputDate />
        <Form form={form} onSubmit={onSubmit} className="TestForm">
          <FormTextField name="email" label="Email" type="email" />
          <FormSelectField name="username" label="Type" options={options} />
          <Button type="submit">Complete</Button>
        </Form>
      </Card>
    </div >
  );
};