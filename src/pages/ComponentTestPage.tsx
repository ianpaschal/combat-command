import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Plus } from 'lucide-react';
import { z } from 'zod';

import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { FloatingActionButton } from '~/components/FloatingActionButton';
import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button/Button';
import { Card } from '~/components/generic/Card';
import { Checkbox } from '~/components/generic/Checkbox';
import { FlagCircle } from '~/components/generic/FlagCircle';
import { Form, FormField } from '~/components/generic/Form';
import { InputDate } from '~/components/generic/InputDate';
import { InputSelect, InputSelectItem } from '~/components/generic/InputSelect/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Stack } from '~/components/generic/Stack';
import { Switch } from '~/components/generic/Switch';
import { Tag } from '~/components/generic/Tag';
import { UserPortrait } from '~/components/UserPortrait';

import './ComponentTestPage.scss';

const formSchema = z.object({
  email: z.string().min(5, {
    message: 'Email must be at least 5 characters.',
  }),
  username: z.string(),
  useTeams: z.boolean(),
});

type FormInput = z.infer<typeof formSchema>;

export const ComponentTestPage = (): JSX.Element => {
  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      useTeams: false,
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
        <Button><Camera />Test</Button>
        <Button variant="solid" muted><Camera />Test</Button>
        <Button variant="outlined"><Camera />Test</Button>
        <Button variant="outlined" muted><Camera />Test</Button>
        <Button variant="ghost"><Camera />Test</Button>
        <Button>Test</Button>
        <Button variant="solid" muted>Test</Button>
        <Button variant="outlined">Test</Button>
        <Button variant="outlined" muted>Test</Button>
        <Button variant="ghost">Test</Button>
        <Button><Camera /></Button>
        <Button variant="solid" muted><Camera /></Button>
        <Button variant="outlined"><Camera /></Button>
        <Button variant="outlined" muted><Camera /></Button>
        <Button variant="ghost"><Camera /></Button>
      </Card>

      <Card>
        <Tag>Hello</Tag><Tag>World</Tag>
        <Stack>
          Hello world
          <UserPortrait name="Ian Paschal With a long name" orientation="horizontal">
            <Avatar />
          </UserPortrait>
          <UserPortrait name="Ian Paschal" orientation="vertical">
            <Avatar />
          </UserPortrait>
          <UserPortrait name="Netherlands" orientation="horizontal">
            <FlagCircle code="nl" />
          </UserPortrait>
          <UserPortrait name="Netherlands" orientation="horizontal" reversed>
            <FlagCircle code="nl" />
          </UserPortrait>
          <UserPortrait name="Germany" orientation="vertical">
            <FlagCircle code="de" />
          </UserPortrait>
          {/* <span className="fi fi-gb-wls fis" style={{ width: '6rem', height: '6rem', borderRadius: '100%' }} /> */}
          <Avatar countryCode="nl" avatarUrl="https://github.com/shadcn.png" />
          <FlagCircle code="nl" />
        </Stack>

      </Card>

      {/* LOW PRIORITY */}
      {/* <InputFile */}
      {/* <InputCheckbox options={}/> */}

      <Card>
        <InputText />
        <InputDate />
        <Form form={form} onSubmit={onSubmit} className="TestForm">
          <FormField name="email" label="Email">
            <InputText type="email" />
          </FormField>
          <FormField name="username" label="Username" description="What the world will know you as">
            <InputSelect options={options} />
          </FormField>
          <FormField name="useTeams" label="Teams" description="Where will this appear?">
            <Checkbox />
          </FormField>
          <FormField name="useTeams" label="Teams">
            <Checkbox variant="outlined" />
          </FormField>
          <FormField name="useSwitch" label="A Switch" description="Some description">
            <Switch />
          </FormField>
          <Button type="submit">Complete</Button>
        </Form>
      </Card>
      <CheckInMatchDialog>
        <FloatingActionButton>
          <Plus />
        </FloatingActionButton>
      </CheckInMatchDialog>
    </div >
  );
};