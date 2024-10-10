import { cloneElement, ReactElement } from 'react';
import clsx from 'clsx';

import './UserPortrait.scss';

export interface UserPortraitProps {
  name: string;
  children: ReactElement;
  orientation?: 'vertical' | 'horizontal';
  reversed?: boolean;
  className?: string;
  size?: number | string;
}

export const UserPortrait = ({
  className,
  children,
  orientation = 'vertical',
  name,
  reversed = false,
  size,
}: UserPortraitProps): JSX.Element => (
  <div className={clsx('UserPortrait', `UserPortrait-${orientation}`, reversed && `UserPortrait-${orientation}Reversed`, className)}>
    {cloneElement(children, { size: size || (orientation === 'horizontal' ? '2.5rem' : '4.5rem') })}
    <div className="UserPortraitName" data-orientation={orientation}>
      {name}
    </div>
  </div>
);