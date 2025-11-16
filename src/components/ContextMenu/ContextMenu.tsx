import { Ellipsis } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { ElementSize } from '~/types/componentLib';
import { Action, ActionKey } from './ContextMenu.types';

export interface ContextMenuProps {
  className?: string;
  actions: Partial<Record<ActionKey, Action>>,
  size?: ElementSize;
  variant?: 'secondary' | 'primary';
}

export const ContextMenu = ({
  className,
  actions,
  size = 'normal',
  variant = 'secondary',
}: ContextMenuProps): JSX.Element | null => {
  const visibleMenuItems = Object.values(actions).map(({ label, handler }) => ({
    label,
    onClick: handler,
  }));
  if (!visibleMenuItems.length) {
    return null;
  }
  return (
    <PopoverMenu menuItems={visibleMenuItems}>
      <Button
        className={className}
        icon={<Ellipsis />}
        size={size}
        variant={variant}
      />
    </PopoverMenu>
  );
};
