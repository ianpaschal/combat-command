import { ChangeEvent } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Pencil } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { useDeleteAvatar } from '~/services/avatar/useDeleteAvatar';
import { useUpdateAvatar } from '~/services/avatar/useUpdateAvatar';
import { useFetchUserProfile } from '~/services/userProfile/useFetchUserProfile';

import styles from './AvatarEditable.module.scss';

export const AvatarEditable = (): JSX.Element => {
  const { user } = useAuth();
  const { data: userProfile } = useFetchUserProfile(user?.id);
  const updateAvatar = useUpdateAvatar();
  const deleteAvatar = useDeleteAvatar();

  const handleUpdate = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error('You must select an image to upload.');
    }
    const file = event.target.files[0];
    if (userProfile && file) {
      updateAvatar.mutate({ userProfile, file });
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (userProfile) {
      deleteAvatar.mutate({ userProfile });
    }
  };

  const isLoading = updateAvatar.isPending;

  return (
    <div className={styles.Root}>
      <Avatar userId={userProfile?.user_id} size={128} loading={isLoading} />
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button className={styles.EditButton} round disabled={isLoading}><Pencil /></Button>
        </Popover.Trigger>
        <Popover.Content align="end" className={styles.ActionsMenu}>
          <Popover.Close asChild>
            <Button variant="ghost">
              <label className={styles.UploadButton} htmlFor="single">
                {userProfile?.avatar_url ? 'Replace' : 'Upload'}
              </label>
            </Button>
          </Popover.Close>
          <Popover.Close asChild>
            <Button variant="ghost" onClick={handleDelete}>
              Remove
            </Button>
          </Popover.Close>
        </Popover.Content>
      </Popover.Root>
      <input
        className={styles.Input}
        type="file"
        id="single"
        accept="image/*"
        onChange={handleUpdate}
        disabled={isLoading}
      />
    </div>
  );
};