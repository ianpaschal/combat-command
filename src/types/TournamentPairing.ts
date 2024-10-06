import { z } from 'zod';

import { DbRecord } from '~/types/DbRecord';
import { tournamentCompetitorSchema } from '~/types/TournamentCompetitor';

export const tournamentPairingSchema = z.object({
  tournament_id: z.string().uuid(),
  round_index: z.number().min(0),
  table_index: z.number().min(0),
  competitors: z.array(tournamentCompetitorSchema).min(2).max(2),
});

export type TournamentPairing = z.infer<typeof tournamentPairingSchema>;

export type TournamentPairingRecord = TournamentPairing & DbRecord;

export const createPairingsSwiss = (tournamentId: string, tableCount: number, rankings: string[], previousParings?: TournamentPairing[]): TournamentPairing[] => {
  
  const opponentPairs: { opponents: [string, string], unplayedTables: number[] }[] = [];

  const availableOpponents = [...rankings];
  const availableTables: number[] = Array(tableCount).fill(1).map((e,i) => e+(i*1));

  while (availableOpponents.length > 1) {
    const [currentOpponent, ...possibleOpponents] = availableOpponents;

    const unplayedOpponents = possibleOpponents.filter((opponent) => {
      if (previousParings && previousParings.find((pairing) => (
        pairing.opponents.includes(currentOpponent) && pairing.opponents.includes(opponent)
      ))) {
        return false;
      }
      return true;
    });
    const matchedOpponent = unplayedOpponents[0];

    // TODO: Add table selection
    const unplayedTables = availableTables.filter((table) => {
      if (previousParings && previousParings.find((pairing) => {
        const playedByCurrentOpponent = pairing.opponents.includes(currentOpponent);
        const playedByMatchedOpponent = pairing.opponents.includes(matchedOpponent);

        return (playedByCurrentOpponent || playedByMatchedOpponent) && pairing.table === table;
      })) {
        return false;
      }
      return true;
    });

    // Add the new pairing to the list, and remove each ID from the pool
    opponentPairs.push({
      opponents: [currentOpponent, matchedOpponent],
      unplayedTables,
    });
    availableOpponents.splice(availableOpponents.indexOf(currentOpponent), 1);
    availableOpponents.splice(availableOpponents.indexOf(matchedOpponent), 1);
  }
  
  return opponentPairs.map((pairing) => ({
    tournament_id: tournamentId,
    opponents: pairing.opponents,
  }));
};

export const assignTables = (pairings: { opponents: [string, string], unplayedTables: number[] }[]) => {

  pairings.sort((a,b) => a.unplayedTables.length - b.unplayedTables.length);
};