import { ReactElement } from 'react';
import clsx from 'clsx';

import styles from './MenuItem.module.scss';

interface MenuItemProps {
  label: string;
  icon: ReactElement;
  onClick?: () => void;
  visible?: boolean;
  disabled?: boolean;
}

export const MenuItem = ({
  label,
  icon,
  onClick,
  visible = true,
  disabled = false,
}: MenuItemProps): JSX.Element | null => {
  if (!visible) {
    return null;
  }
  return (
    <div
      className={clsx('MenuItem', styles.MenuItem, { [styles['MenuItem-disabled']]: disabled })}
      onClick={!disabled && onClick ? onClick : undefined}
      role="button"
    >
      {icon}
      {label}
    </div>
  );
};
