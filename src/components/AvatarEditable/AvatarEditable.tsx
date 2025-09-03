import { ChangeEvent } from 'react';
import { Pencil } from 'lucide-react';
import { Popover } from 'radix-ui';

import { useAuth } from '~/components/AuthProvider';
import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { useUploadAvatar } from '~/services/avatar/useUploadAvatar';

import styles from './AvatarEditable.module.scss';

export const AvatarEditable = (): JSX.Element => {
  const user = useAuth();
  const { uploadAvatar, isLoading } = useUploadAvatar();

  const handleUpdate = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!event.target.files || event.target.files.length === 0) {
      throw new Error('You must select an image to upload.');
    }
    const file = event.target.files[0];
    if (user && file) {
      uploadAvatar(user._id, file);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (user) {
      // TODO: Allow delete of avatar
      // deleteAvatar.mutate({ user });
    }
  };

  return (
    <div className={styles.Root}>
      <Avatar className={styles.Avatar} url={user?.avatarUrl} loading={isLoading} />
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button className={styles.EditButton} round disabled={isLoading}><Pencil /></Button>
        </Popover.Trigger>
        <Popover.Content align="end" className={styles.ActionsMenu}>
          <Popover.Close asChild>
            <Button variant="ghost">
              <label className={styles.UploadButton} htmlFor="single">
                {user?.avatarUrl ? 'Replace' : 'Upload'}
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
