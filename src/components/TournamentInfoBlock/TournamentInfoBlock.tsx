import {
  GameSystem,
  getGameSystemDisplayName,
  getTournamentPairingMethodDisplayName,
} from '@ianpaschal/combat-command-game-systems/common';
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
} from 'lucide-react';

import { GameSystemTypeGuard } from '~/components/GameSystemTypeGuard';
import { getLocalizedCompetitorFee } from '~/components/TournamentInfoBlock/TournamentInfoBlock.utils';
import { useTournament } from '~/components/TournamentProvider';
import { FlamesOfWarV4InfoLine } from './gameSystems/FlamesOfWarV4InfoLine';
import { TeamYankeeV2InfoLine } from './gameSystems/TeamYankeeV2InfoLine';

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
            <span>{getGameSystemDisplayName(tournament.gameSystem)}</span>
          </div>
          <div className={styles.TournamentInfoBlock_InfoLine}>
            {tournament.gameSystem === GameSystem.FlamesOfWarV4 && (
              <GameSystemTypeGuard.FlamesOfWarV4
                gameSystemConfig={tournament.gameSystemConfig}
                render={(props) => (
                  <FlamesOfWarV4InfoLine {...props} />
                )}
              />
            )}
            {tournament.gameSystem === GameSystem.TeamYankeeV2 && (
              <GameSystemTypeGuard.TeamYankeeV2
                gameSystemConfig={tournament.gameSystemConfig}
                render={(props) => (
                  <TeamYankeeV2InfoLine {...props} />
                )}
              />
            )}
          </div>
          <div className={styles.TournamentInfoBlock_InfoLine}>
            <Swords />
            <span>{`${tournament.roundCount} rounds`}</span>
            <span>{`${getTournamentPairingMethodDisplayName(tournament.pairingMethod)} pairing`}</span>
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
