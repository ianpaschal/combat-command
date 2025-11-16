import { getRankingFactorDisplayName } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';

import {
  RankingFactor,
  Tournament,
  TournamentCompetitor,
  TournamentCompetitorId,
  TournamentRegistration,
  TournamentRegistrationId,
} from '~/api';
import { InfoPopover } from '~/components/generic/InfoPopover';
import { ColumnDef } from '~/components/generic/Table';
import { IdentityBadge } from '~/components/IdentityBadge';

import styles from './TournamentRankingsCard.module.scss';

export type RankingRow = {
  id: TournamentCompetitorId | TournamentRegistrationId;
  rank: number;
  rankingFactors: Record<RankingFactor, number>;
};

export type UseTournamentRankingColumnsConfig = {
  view: 'competitors' | 'players';
  tournament: Tournament;
  competitors: TournamentCompetitor[];
  registrations: TournamentRegistration[];
};

export const getTournamentRankingTableConfig = (
  config: UseTournamentRankingColumnsConfig,
): ColumnDef<RankingRow>[] => ([
  {
    key: 'rank',
    label: 'Rank',
    xAlign: 'center',
    renderCell: (r) => (
      <div className={styles.TournamentRankingsCard_RankCell}>
        {r.rank + 1}
      </div>
    ),
  },
  {
    key: 'identity',
    width: '1fr',
    label: config.view === 'competitors' ? (config.tournament.useTeams ? 'Team' : 'Player') : 'Player',
    renderCell: (r) => {
      const competitor = config.competitors.find((c) => c._id === r.id);
      const registration = config.registrations.find((c) => c._id === r.id);
      if (config.view === 'competitors' && competitor) {
        return (
          <IdentityBadge
            size="small"
            competitor={competitor}
            className={styles.TournamentRankingsCard_IdentityBadge}
          />
        );
      }
      if (config.view === 'players' && registration) {
        return (
          <IdentityBadge
            size="small"
            user={registration.user}
            className={styles.TournamentRankingsCard_IdentityBadge}
          />
        );
      }
      return null;
    },
  },
  ...config.tournament.rankingFactors.map((key): ColumnDef<RankingRow> => ({
    key,
    width: '2rem',
    xAlign: 'center',
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
