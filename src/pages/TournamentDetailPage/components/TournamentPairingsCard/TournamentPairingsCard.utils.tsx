import { Swords } from 'lucide-react';

import { TournamentPairing } from '~/api';
import { CircularProgress } from '~/components/generic/CircularProgress';
import { InfoPopover } from '~/components/generic/InfoPopover';
import { ColumnDef } from '~/components/generic/Table';
import { TournamentPairingRow } from '~/components/TournamentPairingRow';

import styles from './TournamentPairingsCard.module.scss';

const matchIndicatorSize = 40; // 2.5rem

export const getTournamentPairingTableConfig = (): ColumnDef<TournamentPairing>[] => [
  {
    key: 'table',
    label: 'Table',
    width: 40,
    align: 'center',
    renderCell: (r) => (
      <div className={styles.TournamentPairingsCard_Table}>
        {r.table === null ? '-' : r.table + 1}
      </div>
    ),
  },
  {
    key: 'pairing',
    label: 'Pairing',
    align: 'center',
    renderCell: (r) => (
      <TournamentPairingRow
        pairing={r}
        className={styles.TournamentPairingsCard_Pairing}
      />
    ),
  },
  {
    key: 'matches',
    width: matchIndicatorSize,
    align: 'center',
    renderCell: ({ matchResultsProgress: { submitted, required } }) => (
      <CircularProgress total={required} filled={submitted} size={matchIndicatorSize} color={submitted === required ? 'green' : undefined}>
        <span className={styles.TournamentPairingsCard_MatchIndicatorInner}>{submitted}</span>
      </CircularProgress>
    ),
    renderHeader: () => (
      <InfoPopover content="Submitted Matches">
        <Swords className={styles.TournamentPairingsCard_MatchIndicatorIcon} />
      </InfoPopover>
    ),
  },
];
