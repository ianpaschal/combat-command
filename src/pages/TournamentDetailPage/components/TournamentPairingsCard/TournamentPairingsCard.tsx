import { ReactElement, useState } from 'react';
import clsx from 'clsx';
import { Zap } from 'lucide-react';

import { InputSelect } from '~/components/generic/InputSelect';
import { Table } from '~/components/generic/Table';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentPairings } from '~/services/tournamentPairings';
import { TournamentDetailCard } from '../TournamentDetailCard';
import { TournamentTabEmptyState } from '../TournamentTabEmptyState';
import { getTournamentPairingTableConfig } from './TournamentPairingsCard.utils';

import styles from './TournamentPairingsCard.module.scss';

export interface TournamentPairingsCardProps {
  className?: string;
}

export const TournamentPairingsCard = ({
  className,
}: TournamentPairingsCardProps): JSX.Element => {
  const { _id: tournamentId, currentRound, lastRound } = useTournament();
  const [round, setRound] = useState<number>(currentRound ?? 0);
  const { data: tournamentPairings, loading } = useGetTournamentPairings({
    tournamentId,
    round,
  });
  const columns = getTournamentPairingTableConfig();
  const rows = (tournamentPairings || []);

  const showEmptyState = !loading && !rows.length;
  const showLoadingState = loading;

  const getRoundIndexes = (): number[] => {
    if (currentRound === undefined && lastRound === undefined) {
      return [];
    }
    if (currentRound === undefined && lastRound !== undefined) {
      return Array.from({ length: lastRound + 1 }, (_, i) => i);
    }
    if (currentRound !== undefined) {
      return Array.from({ length: currentRound + 1 }, (_, i) => i);
    }
    return [];
  };
  const roundOptions = getRoundIndexes().map((round) => ({
    label: `Round ${round + 1}`,
    value: round,
  }));

  const getPrimaryButtons = (): ReactElement[] | undefined => [
    <InputSelect
      options={roundOptions}
      value={round}
      onChange={(selected) => setRound(selected as number)}
      disabled={showLoadingState || showEmptyState}
    />,
  ];

  return (
    <TournamentDetailCard
      className={clsx(styles.TournamentPairingsCard, className)}
      title="Pairings"
      buttons={getPrimaryButtons()}
    >
      {showLoadingState ? (
        <div className={styles.TournamentPairingsCard_EmptyState}>
          Loading...
        </div>
      ) : (
        showEmptyState ? (
          <TournamentTabEmptyState icon={<Zap />} />
        ) : (
          <Table columns={columns} rows={rows} rowClassName={styles.TournamentPairingsCard_Row} />
        )
      )}
    </TournamentDetailCard>
  );
};
