import { ReactElement } from 'react';
import { Trophy } from 'lucide-react';

import {
  Tournament,
  TournamentCompetitor,
  TournamentPairing,
  UserId,
} from '~/api';
import { EmptyState } from '~/components/EmptyState';
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

  const competitor0UserIds = pairing.tournamentCompetitor0.registrations.map((r) => r.user?._id);
  if (competitor0UserIds.includes(userId)) {
    return pairing.tournamentCompetitor1;
  }

  const competitor1UserIds = (pairing.tournamentCompetitor1?.registrations ?? []).map((r) => r.user?._id);
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
  competitors: TournamentCompetitor[] = [],
): ReactElement => (
  !competitors.length ? (
    <EmptyState icon={<Trophy />} />
  ) : (
    <Table
      className={styles.ActiveTournament_Rankings}
      rowClassName={styles.ActiveTournament_Rankings_Row}
      rows={(competitors ?? []).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))}
      columns={[
        {
          key: 'rank',
          label: 'Rank',
          width: 40,
          align: 'center',
          renderCell: ({ rank }) => (
            <div>
              {tournament.lastRound !== undefined && rank !== undefined ? rank + 1 : '-'}
            </div>
          ),
        },
        {
          key: 'identity',
          label: tournament?.useTeams ? 'Team' : 'Player',
          renderCell: (competitor) => (
            <IdentityBadge
              size="small"
              competitor={competitor}
              className={styles.TournamentRankingsCard_IdentityBadge}
            />
          ),
        },
      ]}
    />
  )
);
