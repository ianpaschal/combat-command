import { Ellipsis } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { ElementSize } from '~/types/componentLib';
import { Action } from './ContextMenu.types';

export interface ContextMenuProps {
  className?: string;
  actions: Action[],
  size?: ElementSize;
  variant?: 'secondary' | 'primary';
}

export const ContextMenu = ({
  className,
  actions,
  size = 'normal',
  variant = 'secondary',
}: ContextMenuProps): JSX.Element | null => {
  const menuItems = actions.map(({ handler, ...restProps }) => ({
    ...restProps,
    onClick: handler,
  }));
  return (
    <PopoverMenu menuItems={menuItems}>
      <Button
        className={className}
        icon={<Ellipsis />}
        size={size}
        variant={variant}
      />
    </PopoverMenu>
  );
};
