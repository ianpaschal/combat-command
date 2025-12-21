import { Ellipsis } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { PopoverMenu } from '~/components/generic/PopoverMenu';
import { ElementSize } from '~/types/componentLib';
import { useTournamentCompetitor } from './TournamentCompetitorProvider.hooks';

export interface TournamentCompetitorContextMenuProps {
  className?: string;
  size?: ElementSize;
  variant?: 'secondary' | 'primary';
}

// TODO: Make into generic context menu with a set of actions:
export const TournamentCompetitorContextMenu = ({
  className,
  size = 'normal',
  variant = 'secondary',
}: TournamentCompetitorContextMenuProps): JSX.Element | null => {
  const { actions } = useTournamentCompetitor();
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
