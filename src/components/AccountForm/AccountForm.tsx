import { useAuth } from '~/components/AuthProvider';
import { ChangePasswordForm } from '~/components/ChangePasswordForm/';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { Separator } from '~/components/generic/Separator';

import styles from './AccountForm.module.scss';

export const AccountForm = (): JSX.Element => {
  const user = useAuth();
  return (
    <div className={styles.Root}>
      <Label>Email</Label>
      {user?.email}
      <Button muted>Change Email</Button>
      <Separator />
      <ChangePasswordForm />
      <Separator />
      <Button intent="danger" muted>Delete Account</Button>
    </div>
  );
};