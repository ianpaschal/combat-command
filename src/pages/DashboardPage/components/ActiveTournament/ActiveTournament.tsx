import { generatePath, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronRight, Plus } from 'lucide-react';

import {
  Tournament,
  TournamentCompetitorRanked,
  TournamentPairing,
} from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { CheckInMatchDialog } from '~/components/CheckInMatchDialog';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { IdentityBadge } from '~/components/IdentityBadge';
import { TournamentActionsProvider } from '~/components/TournamentActionsProvider';
import { TournamentContextMenu } from '~/components/TournamentContextMenu';
import { TournamentProvider } from '~/components/TournamentProvider';
import { TournamentTimer } from '~/components/TournamentTimer';
import { PATHS } from '~/settings';
import { Header } from '../Header';
import {
  getOpponent,
  renderRankings,
  renderTitle,
} from './ActiveTournament.utils';

import styles from './ActiveTournament.module.scss';

export interface ActiveTournamentProps {
  className?: string;
  tournament: Tournament;
  pairing?: TournamentPairing;
  rankedCompetitors?: TournamentCompetitorRanked[];
}

export const ActiveTournament = ({
  className,
  tournament,
  pairing,
  rankedCompetitors = [],
}: ActiveTournamentProps): JSX.Element => {
  const navigate = useNavigate();
  const user = useAuth();

  const opponent = getOpponent(user?._id, pairing);

  const handleViewMore = (): void => {
    navigate(generatePath(PATHS.tournamentDetails, { id: tournament._id }));
  };

  const isOrganizer = user && tournament && tournament.organizerUserIds.includes(user._id);
  const showTimer = tournament && tournament.currentRound !== undefined;
  const showOpponent = tournament && pairing && opponent;
  const showRankings = tournament && rankedCompetitors;

  return (
    <div className={clsx(styles.ActiveTournament, className)}>
      <TournamentProvider tournament={tournament}>
        <Header title={renderTitle(tournament.title)}>
          {isOrganizer && (
            <TournamentActionsProvider>
              <TournamentContextMenu variant="secondary" />
            </TournamentActionsProvider>
          )}
          <Button variant="secondary" onClick={handleViewMore}>
            <ChevronRight />
          </Button>
        </Header>
        {showTimer && (
          <>
            <TournamentTimer className={styles.ActiveTournament_Timer} />
            <Separator />
          </>
        )}
        {showOpponent && (
          <>
            <div className={styles.ActiveTournament_OpponentSection}>
              <h3 className={styles.ActiveTournament_OpponentSection_OpponentLabel}>
                {tournament.currentRound !== undefined ? 'Current Opponent' : 'Next Opponent'}
              </h3>
              <IdentityBadge
                className={styles.ActiveTournament_OpponentSection_Opponent}
                competitor={opponent}
              />
              <h3 className={styles.ActiveTournament_OpponentSection_TableLabel}>
                Table
              </h3>
              <span className={styles.ActiveTournament_OpponentSection_Table}>
                {(pairing?.table ?? 0) + 1}
              </span>
              <CheckInMatchDialog tournamentPairingId={pairing._id}>
                <Button className={styles.ActiveTournament_OpponentSection_CheckInButton}>
                  <Plus /> Add Match Result
                </Button>
              </CheckInMatchDialog>
            </div>
            <Separator />
          </>
        )}
        {showRankings && renderRankings(tournament, rankedCompetitors)}
      </TournamentProvider>
    </div>
  );
};
