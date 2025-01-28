import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getNames } from 'i18n-iso-countries';

import { useAuth } from '~/components/AuthProvider';
import { AvatarEditable } from '~/components/AvatarEditable';
import { Button } from '~/components/generic/Button';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { useFetchUserProfile } from '~/services/userProfile/useFetchUserProfile';
import { useUpdateUserProfile } from '~/services/userProfile/useUpdateUserProfile';
import { userProfileNameVisibilityOptions } from '~/types/UserProfileNameVisibility';
import {
  defaultValues,
  UserProfileFormData,
  userProfileFormSchema,
} from './UserProfileForm.utils';

import styles from './UserProfileForm.module.scss';

export const UserProfileForm = (): JSX.Element => {
  const { user } = useAuth();

  const { data: userProfile } = useFetchUserProfile(user?.id);
  const updateProfile = useUpdateUserProfile();

  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues,
    values: { ...defaultValues, ...userProfile },
  });

  const onSubmit: SubmitHandler<UserProfileFormData> = (data) => {
    updateProfile.mutate({ userId: user!.id, data });
  };

  const countries = getNames('en', { select: 'alias' });
  const countryOptions = Object.entries(countries).map(([key, value]) => ({
    label: value,
    value: key.toLowerCase(),
  }));

  return (
    <Form form={form} onSubmit={onSubmit} className={styles.Form}>
      <AvatarEditable />
      <FormField name="username" label="Username" description="This is your public display name." disabled>
        <InputText type="text" />
      </FormField>
      <Separator />
      <div className={styles.NameSection}>
        <FormField name="given_name" label="Given Name" className={styles.GivenNameField}>
          <InputText type="text" />
        </FormField>
        <FormField name="family_name" label="Family Name" className={styles.FamilyNameField}>
          <InputText type="text" />
        </FormField>
      </div>
      <FormField name="name_visibility" label="Name Visibility" className={styles.NameVisibilityField}>
        <InputSelect options={userProfileNameVisibilityOptions} />
      </FormField>
      {/* 
      <h3>About Name Privacy</h3>
      <p>You can configure if you want your name to be hidden, visible to friends, tournament organizers & participants, or public. A brief explanation of what these levels mean is as follows:</p>
      <ul>
        <li>Hidden: No one but you can view your name.</li>
        <li>Friends: Only you and users you've added as a friend can view your name.</li>
        <li>Tournaments: Only you, and the participants and organizers of tournaments you attend can view your name.</li>
        <li>Public: Your name will be publicly visible.</li>
      </ul>
      <p>To everyone who <i>can't</i> view your name, your username will be displayed.</p>
      <p>Keep in mind, some tournaments (such as the European Team Championship) require players to use their full name. If you register for a tournament which requires this, you will be prompted to increase your setting to 'Tournament' if it is set to 'Hidden' or 'Friends'.</p>
      <Separator />
      */}
      <FormField name="country_code" label="Country" description="Hidden, but required for some badges and some tournament organizers try to create initial pairings which avoid pairing players from the same local community if possible.">
        <InputSelect options={countryOptions} />
      </FormField>
      <Button
        className={styles.SubmitButton}
        type="submit"
        disabled={updateProfile.isPending}
        loading={updateProfile.isPending}
      >
        Update Profile
      </Button>
    </Form>
  );
};