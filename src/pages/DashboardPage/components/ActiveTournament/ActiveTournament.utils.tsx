import { ReactElement } from 'react';

import {
  Tournament,
  TournamentCompetitor,
  TournamentCompetitorRanked,
  TournamentPairing,
  UserId,
} from '~/api';
import { Pulsar } from '~/components/generic/Pulsar';
import { Table } from '~/components/generic/Table';
import { IdentityBadge } from '~/components/IdentityBadge';

import styles from './ActiveTournament.module.scss';

export const getOpponent = (userId?: UserId, pairing?: TournamentPairing): TournamentCompetitor | null => {
  if (!userId) {
    console.warn('Cannot find opponent without a user ID!');
    return null;
  }
  if (!pairing) {
    console.warn('Cannot find opponent without a pairing!');
    return null;
  }

  const competitor0UserIds = pairing.tournamentCompetitor0.players.map((player) => player.user._id);
  if (competitor0UserIds.includes(userId)) {
    return pairing.tournamentCompetitor1;
  }

  const competitor1UserIds = (pairing.tournamentCompetitor1?.players ?? []).map((player) => player.user._id);
  if (competitor1UserIds.includes(userId)) {
    return pairing.tournamentCompetitor0;
  }

  return null;
};

export const renderTitle = (title: string): ReactElement => (
  <>
    <Pulsar color="red" />
    <h2>
      <span>Live: </span>
      <span>{title}</span>
    </h2>
  </>
);

export const renderRankings = (
  tournament: Tournament,
  competitors?: TournamentCompetitorRanked[],
): ReactElement => (
  <Table
    className={styles.ActiveTournament_Rankings}
    rowClassName={styles.ActiveTournament_Rankings_Row}
    rows={competitors ?? []}
    columns={[
      {
        key: 'rank',
        label: 'Rank',
        width: 40,
        align: 'center',
        renderCell: (r) => (
          <div>
            {tournament.lastRound !== undefined ? r.rank + 1 : '-'}
          </div>
        ),
      },
      {
        key: 'identity',
        label: tournament?.useTeams ? 'Team' : 'Player',
        renderCell: (r) => (
          <IdentityBadge
            size="small"
            competitorId={r.id}
            className={styles.TournamentRankingsCard_IdentityBadge}
          />
        ),
      },
    ]}
  />
);
