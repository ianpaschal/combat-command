import clsx from 'clsx';
import { Users } from 'lucide-react';

import { TournamentCompetitor } from '~/api';

import styles from './PlayerCount.module.scss';

export interface PlayerCountProps {
  className?: string;
  competitor: TournamentCompetitor;
  competitorSize: number;
}

export const PlayerCount = ({
  className,
  competitor,
  competitorSize,
}: PlayerCountProps): JSX.Element => {
  const playerCount = (competitor.registrations ?? []).filter((p) => p.active).length;
  return (
    <div className={clsx(styles.PlayerCount, className)} data-full={playerCount === competitorSize}>
      <Users />
      {`${playerCount}/${competitorSize}`}
    </div>
  );
};
