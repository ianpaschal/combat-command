import { useAuth } from '~/components/AuthProvider';
import { ChangeEmailDialog } from '~/components/ChangeEmailDialog';
import { ChangePasswordDialog } from '~/components/ChangePasswordDialog';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';

import styles from './AccountSettings.module.scss';

export const AccountSettings = (): JSX.Element => {
  const user = useAuth();
  return (
    <div className={styles.Root}>
      <Label>Email</Label>
      <div className={styles.EmailLine}>
        {user?.email}
        {/* {user?.email_confirmed_at ? <Tag><Check />Verified</Tag> : <Tag><X />Unverified</Tag>} */}
      </div>
      <ChangeEmailDialog trigger={<Button muted>Change Email</Button>} />
      <Separator />
      <Label>Password</Label>
      <ChangePasswordDialog trigger={<Button muted>Change Password</Button>} />
      {/* TODO: Re-enable */}
      {/* <Separator />
      <Button intent="danger" muted>Delete Account</Button> */}
    </div>
  );
};
