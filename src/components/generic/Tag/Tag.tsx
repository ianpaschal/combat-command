import { ReactNode } from 'react';
import clsx from 'clsx';

import './Tag.scss';

export interface TagProps {
  children: ReactNode;
  className?: string;
}
export const Tag = ({
  children,
  className,
}: TagProps): JSX.Element => (
  <span className={clsx('Tag', className)}>
    {children}
  </span>
);