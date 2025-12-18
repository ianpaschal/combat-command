import { getRankingFactorDisplayName } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';

import { League, LeagueRanking } from '~/api';
import { InfoPopover } from '~/components/generic/InfoPopover';
import { ColumnDef } from '~/components/generic/Table';
import { IdentityBadge } from '~/components/IdentityBadge';

import styles from './LeagueRankingsCard.module.scss';

export const getLeagueRankingTableConfig = (
  league: League,
): ColumnDef<LeagueRanking>[] => ([
  {
    key: 'rank',
    label: 'Rank',
    width: 40,
    align: 'center',
    renderCell: (r) => <div>{r.rank + 1}</div>,
  },
  {
    key: 'identity',
    label: 'Player',
    renderCell: (r) => (
      <IdentityBadge
        size="small"
        user={r.user}
        placeholder={{ displayName: 'Unknown Player' }}
        className={styles.LeagueRankingsCard_IdentityBadge}
      />
    ),
  },
  {
    key: 'tournamentCount',
    width: 40,
    align: 'center',
    renderCell: (r) => r.tournamentCount,
    renderHeader: () => (
      <InfoPopover content={'Tournaments Played'}>
        <h3>T</h3>
      </InfoPopover>
    ),
  },
  ...league.rankingFactors.map((key): ColumnDef<LeagueRanking> => ({
    key,
    width: 40,
    align: 'center',
    renderCell: (r) => r.rankingFactors[key],
    renderHeader: () => {
      const long = getRankingFactorDisplayName(key);
      const short = getRankingFactorDisplayName(key, true);
      return (
        <InfoPopover key={key} content={long ?? 'Unknown Factor'}>
          <h3>{short ?? '?'}</h3>
        </InfoPopover>
      );
    },
  })),
]);
