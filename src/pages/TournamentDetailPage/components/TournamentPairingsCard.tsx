import { useState } from 'react';

import { InputSelect } from '~/components/generic/InputSelect';
import { TournamentPairingsList } from '~/components/TournamentPairingsList';
import { useTournament } from '~/components/TournamentProvider';
import { useGetTournamentPairings } from '~/services/tournamentPairings/useGetTournamentPairings';

import { TournamentDetailsCard } from './TournamentDetailsCard';

export const TournamentPairingsCard = () => {
  const { _id: tournamentId, currentRound, lastRound } = useTournament();
  const [round, setRound] = useState<number>(currentRound ?? 0);
  const { data: tournamentPairings, loading } = useGetTournamentPairings({
    tournamentId,
    round: round,
  });

  const getPairingRoundIndexes = (): number[] => {
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
  const roundOptions = getPairingRoundIndexes().map((round) => ({
    label: `Round ${round + 1}`,
    value: round,
  }));

  const showEmptyState = !(tournamentPairings || []).length;
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
      <TournamentPairingsList />
    </TournamentDetailsCard >
  );
};
