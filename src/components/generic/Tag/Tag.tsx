import { ReactNode } from 'react';

import './Tag.scss';

export interface TagProps {
  children: ReactNode;
}
export const Tag = ({
  children,
}: TagProps): JSX.Element => (
  <span className="Tag">
    {children}
  </span>
);