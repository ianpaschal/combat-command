import { TournamentPairingInput } from '~/types/db/TournamentPairings';
import { RankingFactorKey } from '~/types/fowV4/fowV4RankingFactorSchema';
import { CompetitorResult } from '~/utils/common/calculateTournamentRankings';

export const pairSwiss = <T extends RankingFactorKey>(
  rankedCompetitorResults: CompetitorResult<T>[],
  round_index: number,
  tournament_id: string,
): TournamentPairingInput[] => {
  const pairings: (TournamentPairingInput & { playedTables: number[] })[] = [];
  const pairedCompetitors = new Set<string>();
  const occupiedTables = new Set<number>();

  rankedCompetitorResults.forEach((result) => {
    // Skip if this competitor is already paired
    if (pairedCompetitors.has(result.competitor.id)) {
      return;
    }

    const possibleOpponents = [...rankedCompetitorResults].filter((possibleOpponent) => {
      // Exclude if already played
      if (result.opponentCompetitorIds.includes(possibleOpponent.competitor.id)) {
        return false;
      }

      // Exclude if self
      if (possibleOpponent.competitor.id === result.competitor.id) {
        return false;
      }

      // Exclude if opponent is already paired
      if (pairedCompetitors.has(possibleOpponent.competitor.id)) {
        return false;
      }

      return true;
    });

    if (possibleOpponents.length > 0) {
      // Pair with the first available opponent
      const opponent = possibleOpponents[0];

      // // Find a table index that neither competitor has played at
      // const possibleTables = [...Array(12)].map((_, i) => i).filter((tableIndex) => {
      //   if (result.playedTables.includes(tableIndex)) {
      //     return false;
      //   }
      //   if (opponent.playedTables.includes(tableIndex)) {
      //     return false;
      //   }

      //   // Exclude if table is already occupied
      //   if (occupiedTables.has(tableIndex)) {
      //     return false;
      //   }
      //   return true;
      // });

      // if (possibleTables.length < 1) {
      //   console.warn('NO POSSIBLE TABLES');
      // }

      // console.log('possible tbles', possibleTables);

      // const tableIndex = possibleTables[0];
      
      pairings.push({
        competitor_0_id: result.competitor.id,
        competitor_1_id: opponent.competitor.id,
        round_index,
        table_index: pairings.length,
        tournament_id,
        playedTables: [
          ...result.playedTables,
          ...opponent.playedTables,
        ],
      });

      // Mark both competitors as paired
      pairedCompetitors.add(result.competitor.id);
      pairedCompetitors.add(opponent.competitor.id);
    }
  });

  // Assign tables
  pairings.forEach((pairing, i) => {

    // Find a table index that neither competitor has played at
    const possibleTables = [...Array(12)].map((_, i) => i).filter((tableIndex) => {
      if (pairing.playedTables.includes(tableIndex)) {
        return false;
      }

      // Exclude if table is already occupied
      if (occupiedTables.has(tableIndex)) {
        return false;
      }
      return true;
    });
    console.log(`Pairing ${i} possible tables:`, possibleTables);

    if (possibleTables.length < 1) {
      console.log('ran out of tables');
      const pairingWithSwapableTable = pairings.find((otherPairing) => {
        
        const otherPairingTableCouldTake = !pairing.playedTables.includes(otherPairing.table_index);

        const thisPairingTableCouldGive = pairing.playedTables.filter(
          (tableIndex) => !otherPairing.playedTables.includes(tableIndex),
        );

        if (otherPairingTableCouldTake && thisPairingTableCouldGive) {
          return true;
        }
        return false;
      });

      if (pairingWithSwapableTable) {

        const swapIndex = pairings.findIndex((otherPairing) => otherPairing.competitor_0_id === pairingWithSwapableTable?.competitor_0_id);
        console.log(`Pairing ${i} can swap with pairing ${swapIndex}, which is currently on table`, pairingWithSwapableTable?.table_index);
      
        pairings[i].table_index = pairingWithSwapableTable.table_index;
        console.log(`Pairing ${i} is now on table ${pairingWithSwapableTable.table_index}`);

        const replacementTables = pairing.playedTables.filter(
          (tableIndex) => !pairingWithSwapableTable.playedTables.includes(tableIndex),
        );

        pairingWithSwapableTable.table_index = replacementTables[0];
        console.log(`Pairing ${swapIndex} is now on table ${replacementTables[0]}`);

        occupiedTables.add(replacementTables[0]);
      } else {
        console.warn('COULD NOT SWAP TABLES');
      }
      
    } else {
      const tableIndex = possibleTables[0];
      console.log(`Pairing ${i} is now on table ${possibleTables[0]}`);
      pairings[i].table_index = tableIndex;
      occupiedTables.add(tableIndex);
    }

  });

  return pairings.map(({ playedTables: _, ...rest }) => ({ ...rest }));
};