import { useAuth } from '~/components/AuthProvider';
import { ChangePasswordDialog } from '~/components/ChangePasswordDialog';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';
import { Spinner } from '~/components/generic/Spinner';

import styles from './AccountForm.module.scss';

export const AccountForm = (): JSX.Element => {
  const user = useAuth();
  return (
    <div className={styles.Root}>
      <Label>Email</Label>
      {user?.email}
      <Button muted>Change Email</Button>
      <Separator />
      <Label>Password</Label>
      <ChangePasswordDialog trigger={<Button muted>Change Password</Button>} />
      <Separator />
      <Button intent="danger" muted><Spinner />Delete Account</Button>
    </div>
  );
};