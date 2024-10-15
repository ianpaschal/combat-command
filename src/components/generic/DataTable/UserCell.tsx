import { Avatar } from '~/components/generic/Avatar';

import styles from './CountryCell.module.scss';

export interface UserCellProps {
  userId: string;
}

export const UserCell = ({
  userId,
}: UserCellProps): JSX.Element => {
  // TODO: Fetch user
  const user = { id: userId, name: 'Foo' };
  return (
    <div className={styles.Root}>
      <Avatar displayName={user.name} size={24} />
      <span>
        {user.name}
      </span>
    </div>
  );
};