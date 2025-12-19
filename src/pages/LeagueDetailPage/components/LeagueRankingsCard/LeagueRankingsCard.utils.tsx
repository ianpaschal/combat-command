import { getGameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { League, LeagueRanking } from '~/api';
import { InfoPopover } from '~/components/generic/InfoPopover';
import { ColumnDef } from '~/components/generic/Table';
import { IdentityBadge } from '~/components/IdentityBadge';

import styles from './LeagueRankingsCard.module.scss';

export const getLeagueRankingTableConfig = (
  league: League,
): ColumnDef<LeagueRanking>[] => {
  const gameSystem = getGameSystem(league.gameSystem);
  return [
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
      renderCell: (r) => r.rankingFactors[key] ?? '-',
      renderHeader: () => (
        <InfoPopover content={gameSystem.getRankingFactorDisplayName(key) ?? 'Unknown Factor'}>
          <h3>{gameSystem.getRankingFactorDisplayName(key, true) ?? '?'}</h3>
        </InfoPopover >
      ),
    })),
  ];
};
