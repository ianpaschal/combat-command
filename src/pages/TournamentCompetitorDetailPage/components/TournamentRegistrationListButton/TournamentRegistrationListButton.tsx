import { Badge } from '@ianpaschal/combat-command-components';
import clsx from 'clsx';
import { FilePlusCorner } from 'lucide-react';

import { TournamentRegistration } from '~/api';
import { Button } from '~/components/generic/Button';

import styles from './TournamentRegistrationListButton.module.scss';

export interface TournamentRegistrationListButtonProps {
  className?: string;
  tournamentRegistration: TournamentRegistration;
  deadline?: number;
}

export const TournamentRegistrationListButton = ({
  className,
  tournamentRegistration,
  deadline,
}: TournamentRegistrationListButtonProps): JSX.Element => {

  const isOverdue = deadline && Date.now() > deadline;

  if (tournamentRegistration.lists.length === 0) {
    return (
      <div className={clsx(styles.TournamentRegistrationListButton, className)}>
        <Badge value={isOverdue ? 'Late' : undefined} intent="danger">
          <Button text="List" icon={<FilePlusCorner />} />
        </Badge>
      </div>
    );
  }
  if (tournamentRegistration.lists.length > 1) {
    return (
      <Button className={clsx(styles.TournamentRegistrationListButton, className)} text="View List" />
    );
  }
  return (
    <Button className={clsx(styles.TournamentRegistrationListButton, className)} text="View List" />
  );
};
