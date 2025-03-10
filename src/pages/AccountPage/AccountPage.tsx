import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from '@supabase/supabase-js';
import { z } from 'zod';

import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { Form, FormField } from '~/components/generic/Form';
import { InputText } from '~/components/generic/InputText';
import { PageWrapper } from '~/components/PageWrapper/PageWrapper';
import { RequireAuth } from '~/components/RequireAuth';

const formSchema = z.object({
  email: z.string().min(5, {
    message: 'Email must be at least 5 characters.',
  }),
  username: z.string().min(20, {
    message: 'Username must be at least 20 characters.',
  }),
});

type FormInput = z.infer<typeof formSchema>;

export interface AccountPageProps {
  session: Session;
}

export const AccountPage = (): JSX.Element => {

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const user = useAuth();
  // const [loading, setLoading] = useState(false);

  // const [username, setUsername] = useState<string>('');
  // const [givenName, setGivenName] = useState<string>('');
  // const [surname, setSurname] = useState<string>('');
  // const [avatar_url, setAvatarUrl] = useState<string>('');
  // const [givenNameVisibility, setGivenNameVisibility] = useState<'hidden' | 'friends' | 'tournaments' | 'public'>('hidden');
  // const [surnameVisibility, setSurnameVisibility] = useState<'hidden' | 'friends' | 'tournaments' | 'public'>('hidden');

  // useEffect(() => {
  //   // let ignore = false;
  //   async function getProfile() {
  //     setLoading(true);

  //     const { data, error } = await supabase
  //       .from('profiles')
  //       .select('username, website, avatar_url')
  //       .eq('id', user?.id)
  //       .single();

  //     if (error) {
  //       console.warn(error);
  //     } else if (data) {
  //       setUsername(data.username);
  //       setWebsite(data.website);
  //       setAvatarUrl(data.avatar_url);
  //     }

  //     setLoading(false);
  //   }

  //   if (user?.id) {
  //     getProfile();
  //   }
  // }, [user]);

  // console.log(user);

  // const updateProfile = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
  //   e.preventDefault();

  //   setLoading(true);

  //   const updates = {
  //     id: user?.id,
  //     username,
  //     website,
  //     avatar_url,
  //     updated_at: new Date(),
  //   };

  //   const { error } = await supabase.from('profiles').upsert(updates);

  //   if (error) {
  //     alert(error.message);
  //   } else {
  //     setAvatarUrl(avatar_url);
  //   }
  //   setLoading(false);
  // };

  // async function updateAvatar(avatarUrl) {

  //   setLoading(true);

  //   const updates = {
  //     id: user.id,
  //     avatar_url: avatarUrl,
  //     updated_at: new Date(),
  //   };

  //   const { error } = await supabase.from('profiles').upsert(updates);

  //   if (error) {
  //     alert(error.message);
  //   } else {
  //     setAvatarUrl(avatarUrl);
  //   }
  //   setLoading(false);
  // }

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

  return (
    <RequireAuth>
      <PageWrapper title="Account" maxWidth={720}>

        {/* <Avatar
        url={avatar_url}
        size={150}
        onUpload={(event, url) => {
          updateAvatar(event, url);
        }}
      /> */}
        <Card>
          <Form form={form} onSubmit={onSubmit}>
            <FormField name="email" label="Email">
              <InputText type="email" />
            </FormField>
            <Button type="submit">Complete</Button>
          </Form>
          {/* <form onSubmit={updateProfile}>

            <Flex direction='column' gap='4'>
              <Box>
                <Flex>
                  <label htmlFor='email'>
                    <Text size='2' weight='medium'>Email</Text>
                  </label>
                </Flex>
                <TextField.Root
                  id="email"
                  size="3"
                  value={user?.email}
                  readOnly
                  required
                  type='email'
                />
              </Box>
              <Box>
                <Flex>
                  <label htmlFor='username'>
                    <Text size='2' weight='medium'>Username</Text>
                  </label>
                </Flex>
                <TextField.Root
                  id="username"
                  size="3"
                  value={username}
                  placeholder='Enter your desired username'
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  type='text'
                />
              </Box>
              <Box>
                <Flex>
                  <label htmlFor='givenName'>
                    <Text size='2' weight='medium'>Given Name</Text>
                  </label>
                </Flex>
                <TextField.Root
                  id="givenName"
                  size="3"
                  value={givenName}
                  placeholder='Enter your given name'
                  required
                  onChange={(e) => setGivenName(e.target.value)}
                  type='text'
                />
              </Box>
              <Box>
                <Flex gap="4" align='center'>
                  <label htmlFor='givenNameVisibility'>
                    <Text size='2' weight='medium'>Given Name Visibility</Text>
                  </label>
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                      <IconButton variant="ghost" size='2'>
                        <InfoCircledIcon />
                      </IconButton>
                    </HoverCard.Trigger>
                    <HoverCard.Content maxWidth="300px">
                      <Heading size="3" as="h3">Hidden</Heading>
                      <Text as="div" size="2" color="gray" mb="2">
                        Only you can view your given name.
                      </Text>
                      <Heading size="3" as="h3">Tournaments</Heading>
                      <Text as="div" size="2" color="gray" mb="2">
                        Visible to tournament organizers and fellow participants for tournaments you've signed up for.
                      </Text>
                      <Heading size="3" as="h3">Public</Heading>
                      <Text as="div" size="2" color="gray" mb="2">
                        Visible to everyone.
                      </Text>
                    </HoverCard.Content>
                  </HoverCard.Root>
                </Flex>
                <Flex gap='4' direction='row' align='center'>
                  <Select.Root value={givenNameVisibility} size='3' onValueChange={(value) => setGivenNameVisibility(value)}>
                    <Select.Trigger style={{ width: '100%' }} />
                    <Select.Content>
                      <Select.Item value="hidden">Hidden</Select.Item>
                      <Select.Item value="tournaments">Tournaments</Select.Item>
                      <Select.Item value="public">Public</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Box>
              <Box>
                <Flex>
                  <label htmlFor='surname'>
                    <Text size='2' weight='medium'>Surname</Text>
                  </label>
                </Flex>
                <TextField.Root
                  id="surname"
                  size="3"
                  value={surname}
                  placeholder='Enter your surname'
                  required
                  onChange={(e) => setSurname(e.target.value)}
                  type='text'
                />
              </Box>
              <Box>
                <Flex gap="4" align='center'>
                  <label htmlFor='surnameVisibility'>
                    <Text size='2' weight='medium'>Surname Visibility</Text>
                  </label>
                  <HoverCard.Root>
                    <HoverCard.Trigger>
                      <IconButton variant="ghost" size='2'>
                        <InfoCircledIcon />
                      </IconButton>
                    </HoverCard.Trigger>
                    <HoverCard.Content maxWidth="300px">
                      <Heading size="3" as="h3">Hidden</Heading>
                      <Text as="div" size="2" color="gray" mb="2">
                        Only you can view your given name.
                      </Text>
                      <Heading size="3" as="h3">Tournaments</Heading>
                      <Text as="div" size="2" color="gray" mb="2">
                        Visible to tournament organizers and fellow participants for tournaments you've signed up for.
                      </Text>
                      <Heading size="3" as="h3">Public</Heading>
                      <Text as="div" size="2" color="gray" mb="2">
                        Visible to everyone.
                      </Text>
                    </HoverCard.Content>
                  </HoverCard.Root>
                </Flex>
                <Flex gap='4' direction='row' align='center'>
                  <Select.Root value={surnameVisibility} size='3' onValueChange={(value) => setSurnameVisibility(value)}>
                    <Select.Trigger id="surnameVisibility" style={{ width: '100%' }} />
                    <Select.Content>
                      <Select.Item value="hidden">Hidden</Select.Item>
                      <Select.Item value="tournaments">Tournaments</Select.Item>
                      <Select.Item value="public">Public</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </Flex>
              </Box>
              <Flex justify='end' mt='4'>
                <Button type="submit" disabled={loading}>
                  <Spinner loading={loading}>
                    <CheckIcon />
                  </Spinner>
                  Save Changes
                </Button>
              </Flex>
            </Flex>
          </form> */}
        </Card>
      </PageWrapper>
    </RequireAuth>
  );
};

//  <Button onClick={() => setIsModalOpen(!isModalOpen)}>
//       Open Modal
//     </Button>
//     <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
//       Hello world
//     </Modal>
//     <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
//       Sign Out
//     </button>
//     <DropDownMenu label="Dropdown Button">
//       <DropDownMenuItem label='test 1' onClick={() => console.log('test 1')} />
//       <DropDownMenuItem label='test 2' onClick={() => console.log('test 2')} />
//       <DropDownMenuItem label='test 3' onClick={() => console.log('test 3')} />
//     </DropDownMenu>
{/* <ListDropZone /> */ }
