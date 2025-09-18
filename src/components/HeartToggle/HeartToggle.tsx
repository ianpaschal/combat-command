import { useState } from 'react';
import { Heart } from 'lucide-react';

import { Button } from '~/components/generic/Button';

import styles from './HeartToggle.module.scss';

export interface HeartToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

// TODO: Convert to forwardRef
export const HeartToggle = ({
  checked: externalChecked = false,
  onCheckedChange,
}: HeartToggleProps): JSX.Element => {
  const [checked, setChecked] = useState<boolean>(externalChecked);
  const handleClick = (): void => {
    if (onCheckedChange) {
      onCheckedChange(!checked);
    }
    setChecked(!checked);
  };
  return (
    <Button
      className={styles.Root}
      icon={<Heart className={styles.Icon} data-state={checked ? 'checked' : 'unchecked'} />}
      round
      size="small"
      variant="ghost"
      onClick={handleClick}
    />
  );
};
