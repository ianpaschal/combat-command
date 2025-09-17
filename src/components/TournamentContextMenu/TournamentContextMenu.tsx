import { Ellipsis } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { useTournamentActions } from '~/components/TournamentActionsProvider';
import { ElementSize } from '~/types/componentLib';

export interface TournamentContextMenuProps {
  className?: string;
  size?: ElementSize;
  variant?: 'secondary' | 'primary';
}

export const TournamentContextMenu = ({
  className,
  size = 'normal',
  variant = 'secondary',
}: TournamentContextMenuProps): JSX.Element | null => {
  const actions = useTournamentActions();
  const visibleMenuItems = Object.values(actions).map(({ label, handler }) => ({
    label,
    onClick: handler,
  }));
  if (!visibleMenuItems.length) {
    return null;
  }
  return (
    <PopoverMenu menuItems={visibleMenuItems}>
      <Button className={className} icon={<Ellipsis />} size={size} variant={variant} />
    </PopoverMenu>
  );
};
