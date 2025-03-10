import { cloneElement, ReactElement } from 'react';
import clsx from 'clsx';

import { useFetchUserProfile } from '~/services/userProfile/useFetchUserProfile';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

import './UserPortrait.scss';

export interface UserPortraitProps {
  userId?: string;
  children: ReactElement;
  orientation?: 'vertical' | 'horizontal';
  reversed?: boolean;
  className?: string;
  size?: number | string;
  displayName?: string;
}

export const UserPortrait = ({
  className,
  children,
  orientation = 'vertical',
  userId,
  reversed = false,
  displayName,
  size,
}: UserPortraitProps): JSX.Element => {
  const { data: userProfile } = useFetchUserProfile(userId);
  return (
    <div className={clsx('UserPortrait', `UserPortrait-${orientation}`, reversed && `UserPortrait-${orientation}Reversed`, className)}>
      {cloneElement(children, { size: size || (orientation === 'horizontal' ? '2.5rem' : '4.5rem') })}
      {userProfile && (
        <div className="UserPortraitName" data-orientation={orientation}>
          {getUserDisplayNameString(userProfile)}
        </div>
      )}
      {displayName && (
        <div className="UserPortraitName" data-orientation={orientation}>
          {displayName}
        </div>
      )}
    </div>
  );
};
