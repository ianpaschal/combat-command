import { generatePath, NavigateFunction } from 'react-router-dom';
import { ChevronRight, Swords } from 'lucide-react';

import { TournamentPairing } from '~/api';
import { Button } from '~/components/generic/Button';
import { CircularProgress } from '~/components/generic/CircularProgress';
import { InfoPopover } from '~/components/generic/InfoPopover';
import { ColumnDef } from '~/components/generic/Table';
import { TournamentPairingRow } from '~/components/TournamentPairingRow';
import { PATHS } from '~/settings';

import styles from './TournamentPairingsCard.module.scss';

export const getTournamentPairingTableConfig = (navigate: NavigateFunction): ColumnDef<TournamentPairing>[] => [
  {
    key: 'table',
    label: 'Table',
    xAlign: 'center',
    renderCell: (r) => (
      <div className={styles.TournamentPairingsCard_TableNumber}>
        {r.table === null ? '-' : r.table + 1}
      </div>
    ),
  },
  {
    key: 'pairing',
    label: 'Pairing',
    xAlign: 'center',
    width: '1fr',
    renderCell: (r) => (
      <TournamentPairingRow
        pairing={r}
        className={styles.TournamentPairingsCard_Pairing}
      />
    ),
  },
  {
    key: 'matches',
    xAlign: 'center',
    renderCell: ({ matchResultsProgress: { submitted, required } }) => (
      <CircularProgress total={required} filled={submitted} size={40} color={submitted === required ? 'green' : undefined}>
        <span className={styles.TournamentPairingsCard_MatchIndicatorInner}>{submitted}</span>
      </CircularProgress>
    ),
    renderHeader: () => (
      <InfoPopover content="Submitted Matches">
        <Swords className={styles.TournamentPairingsCard_MatchIndicatorIcon} />
      </InfoPopover>
    ),
  },
  {
    key: 'viewPairing',
    xAlign: 'center',
    renderCell: ({ _id }) => (
      <Button
        icon={<ChevronRight />}
        variant="secondary"
        onClick={() => navigate(generatePath(PATHS.tournamentPairingDetails, { id: _id }))}
      />
    ),
    renderHeader: () => null,
  },
];
