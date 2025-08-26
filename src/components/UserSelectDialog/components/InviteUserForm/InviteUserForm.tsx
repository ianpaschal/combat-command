import clsx from 'clsx';

import styles from './InviteUserForm.module.scss';

export interface InviteUserFormProps {
  className?: string;
}

export const InviteUserForm = ({
  className,
}: InviteUserFormProps): JSX.Element => (
  <div className={clsx(styles.InviteUserForm, className)}>

  </div>
);
