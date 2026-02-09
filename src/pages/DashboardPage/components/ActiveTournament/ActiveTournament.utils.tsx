import { ReactElement } from 'react';
import { Table } from '@ianpaschal/combat-command-components';
import { Trophy } from 'lucide-react';

import {
  Tournament,
  TournamentCompetitor,
  TournamentPairing,
  UserId,
} from '~/api';
import { EmptyState } from '~/components/EmptyState';
import { Pulsar } from '~/components/generic/Pulsar';
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

  const competitor0UserIds = (pairing.tournamentCompetitor0?.registrations ?? []).map((r) => r.userId);
  if (competitor0UserIds.includes(userId)) {
    return pairing.tournamentCompetitor1;
  }

  const competitor1UserIds = (pairing.tournamentCompetitor1?.registrations ?? []).map((r) => r.userId);
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
      rows={[...(competitors ?? [])].sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))}
      columns={[
        {
          key: 'rank',
          label: 'Rank',
          width: 'auto',
          xAlign: 'center',
          renderCell: ({ rank }) => (
            <div>
              {tournament.lastRound !== undefined && rank !== undefined ? rank + 1 : '-'}
            </div>
          ),
        },
        {
          key: 'identity',
          width: '1fr',
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
