import {
  getGameSystemDisplayName,
  getTournamentPairingMethodDisplayName,
  TournamentPairingMethod,
} from '@ianpaschal/combat-command-static-data/common';
import { eraOptions } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import clsx from 'clsx';
import { format } from 'date-fns';
import {
  CalendarClock,
  Dices,
  Link,
  MapPin,
  Swords,
  Ticket,
  Users,
  Weight,
} from 'lucide-react';

import { getLocalizedCompetitorFee } from '~/components/TournamentInfoBlock/TournamentInfoBlock.utils';
import { useTournament } from '~/components/TournamentProvider';

import styles from './TournamentInfoBlock.module.scss';

export interface TournamentInfoBlockProps {
  className?: string;
  type: 'practical' | 'gameSystem';
  compact?: boolean;
}

export const TournamentInfoBlock = ({
  className,
  type,
  // compact = false,
}: TournamentInfoBlockProps): JSX.Element | null => {
  const tournament = useTournament();
  return (
    <div className={clsx(styles.TournamentInfoBlock, className)}>
      {type === 'practical' && (
        <>
          <div className={styles.TournamentInfoBlock_InfoLine}>
            <CalendarClock />
            <span>{format(tournament.startsAt, 'd MMM yyy, p')}</span>
            <span>{format(tournament.endsAt, 'd MMM yyyy, p')}</span>
          </div>
          <div className={styles.TournamentInfoBlock_InfoLine}>
            <MapPin />
            <span>{tournament.location.name}</span>
            <span>{tournament.location.placeFormatted}</span>
          </div>
          <div className={styles.TournamentInfoBlock_InfoLine}>
            <Users />
            <span>{`${tournament.activePlayerCount} / ${tournament.maxPlayers}`}</span>
            {tournament.useTeams && (
              <span>{`(${tournament.competitorCount} / ${tournament.maxCompetitors} teams)`}</span>
            )}
          </div>
          <div className={styles.TournamentInfoBlock_InfoLine}>
            <Ticket />
            <span>{getLocalizedCompetitorFee(tournament)}</span>
          </div>
        </>
      )}
      {type === 'gameSystem' && (
        <>
          <div className={styles.TournamentInfoBlock_InfoLine}>
            <Dices />
            {/* TODO: REMOVE NON-NULL ASSERTION AFTER MIGRATION */}
            <span>{getGameSystemDisplayName(tournament.gameSystem!)}</span>
          </div>
          <div className={styles.TournamentInfoBlock_InfoLine}>
            <Weight />
            <span>{`${tournament.gameSystemConfig.points} pts`}</span>
            <span>{eraOptions.find(({ value }) => value === tournament.gameSystemConfig.era)?.label}</span>
          </div>
          <div className={styles.TournamentInfoBlock_InfoLine}>
            <Swords />
            <span>{`${tournament.roundCount} rounds`}</span>
            {/* TODO: REMOVE ENUM ASSERTION AFTER MIGRATION */}
            <span>{`${getTournamentPairingMethodDisplayName(tournament.pairingMethod as TournamentPairingMethod)} pairing`}</span>
          </div>
          {tournament.rulesPackUrl && (
            <div className={styles.TournamentInfoBlock_InfoLine}>
              <Link />
              <a href={tournament.rulesPackUrl}>Rules Pack</a>
            </div>
          )}
        </>
      )}
    </div>
  );
};
