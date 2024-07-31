import clsx from 'clsx';

import { Avatar } from '~/components/generic/Avatar';
import { Stack } from '~/components/generic/Stack';

import './UserPortrait.scss';

export interface UserPortraitProps {
  givenName?: string;
  username: string;
  familyName?: string;
  avatarUrl?: string;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export const UserPortrait = ({
  className,
  givenName,
  username,
  orientation = 'vertical',
  familyName,
  avatarUrl,
}: UserPortraitProps): JSX.Element => {

  // TODO: Fetch user ID instead
  // To-Do: move to separate function
  const displayName = givenName && familyName ? `${givenName} ${familyName}` : username;
  return (
    <Stack
      className={clsx('UserPortrait', className)}
      orientation={orientation}
      verticalAlign={orientation === 'horizontal' ? 'center' : 'start'}
      horizontalAlign={orientation === 'horizontal' ? 'start' : 'center'}
      gap={'0.5rem'}
    >
      <Avatar displayName={displayName} avatarUrl={avatarUrl} size={orientation === 'horizontal' ? '2.5rem' : '4.5rem'} />
      <div className="UserPortraitName" data-orientation={orientation}>
        {displayName}
      </div>
    </Stack>
  );
};