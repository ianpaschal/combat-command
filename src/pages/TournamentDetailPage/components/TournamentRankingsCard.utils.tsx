import { FowV4TournamentFlatExtendedStats } from 'convex/_model/fowV4/types';

import {
  FowV4RankingFactor,
  TournamentCompetitor,
  TournamentCompetitorId,
  User,
  UserId,
} from '~/api';
import { ColumnDef } from '~/components/generic/Table';
import { IdentityBadge } from '~/components/IdentityBadge';

import styles from './TournamentRankingsCard.module.scss';

export type RankingRow = {
  id: TournamentCompetitorId | UserId;
  rank: number;
  stats: FowV4TournamentFlatExtendedStats;
};

export type UseTournamentRankingColumnsConfig = {
  view: 'competitors' | 'players';
  useTeams: boolean;
  rankingFactors: FowV4RankingFactor[];
  competitors: TournamentCompetitor[];
};

export const getTournamentRankingTableConfig = (
  config: UseTournamentRankingColumnsConfig,
): ColumnDef<RankingRow>[] => {
  const players = config.competitors.reduce((acc, competitor) => [
    ...acc,
    ...competitor.players.map((player) => player.user),
  ], [] as User[]);
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
      label: config.view === 'competitors' ? (config.useTeams ? 'Team' : 'Player') : 'Player',
      renderCell: (r) => {
        const competitor = config.competitors.find((c) => c._id === r.id);
        const player = players.find((p) => p._id === r.id);
        if (config.view === 'competitors' && competitor) {
          return (
            <IdentityBadge
              size="small"
              competitor={competitor}
              className={styles.TournamentRankingsCard_IdentityBadge}
            />
          );
        }
        if (config.view === 'players' && player) {
          return (
            <IdentityBadge
              size="small"
              user={player}
              className={styles.TournamentRankingsCard_IdentityBadge}
            />
          );
        }
        return null;
      },
    },
    ...config.rankingFactors.map((key, i): ColumnDef<RankingRow> => ({
      key,
      label: `RF${i}`,
      width: 32,
      align: 'center',
      renderCell: (r) => r.stats[key],
    })),
  ];
};
