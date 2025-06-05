import { useState } from 'react';

import { InputSelect } from '~/components/generic/InputSelect';
import { Table } from '~/components/generic/Table';
import { useTournament } from '~/components/TournamentProvider';
import { getTournamentPairingTableConfig } from '~/pages/TournamentDetailPage/components/TournamentPairingsCard.utils';
import { useGetTournamentPairings } from '~/services/tournamentPairings/useGetTournamentPairings';
import { TournamentDetailsCard } from './TournamentDetailsCard';

import styles from './TournamentPairingsCard.module.scss';

export const TournamentPairingsCard = () => {
  const { _id: tournamentId, currentRound, lastRound } = useTournament();
  const [round, setRound] = useState<number>(currentRound ?? 0);
  const { data: tournamentPairings, loading } = useGetTournamentPairings({
    tournamentId,
    round,
  });
  const columns = getTournamentPairingTableConfig();
  const rows = (tournamentPairings || []);
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

  const showEmptyState = !loading && !rows.length;
  const showLoadingState = loading;

  return (
    <TournamentDetailsCard
      title="Pairings"
      buttons={[
        <InputSelect
          options={roundOptions}
          value={round}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onChange={(selected) => setRound(selected)}
          disabled={showLoadingState || showEmptyState}
        />,
      ]}
    >
      {showLoadingState ? (
        <div className={styles.TournamentPairingsCard_EmptyState}>
          Loading...
        </div>
      ) : (
        showEmptyState ? (
          <div className={styles.TournamentPairingsCard_EmptyState}>
            Nothing to show yet.
          </div>
        ) : (
          <Table columns={columns} rows={rows} rowClassName={styles.TournamentPairingsCard_Row} />
        )
      )}
    </TournamentDetailsCard >
  );
};
