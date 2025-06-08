import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { tournamentPairingMethod } from '../../../static/tournamentPairingMethods';
import { getTournamentCompetitorListByTournamentId } from '../../tournamentCompetitors';
import { getTournamentRankings } from '../../tournaments';
import { generateDraftAdjacentPairings } from '../_helpers/generateDraftAdjacentPairings';
import { generateDraftRandomPairings } from '../_helpers/generateDraftRandomPairings';
import { DraftTournamentPairings } from '../types';

export const getDraftTournamentPairingsArgs = v.object({
  method: tournamentPairingMethod,
  round: v.number(),
  tournamentId: v.id('tournaments'),
});

/**
 * Gets a DraftTournamentPairings object.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.method - The pairing method to use
 * @param args.round - The upcoming round index which the generated pairing are for
 * @param args.tournamentId - ID of the Tournament
 * @returns A DraftTournamentPairings object
 */
export const getDraftTournamentPairings = async (
  ctx: QueryCtx,
  args: Infer<typeof getDraftTournamentPairingsArgs>,
): Promise<DraftTournamentPairings> => {
  const competitors = await getTournamentCompetitorListByTournamentId(ctx, args);
  const { competitors: rankedCompetitors } = await getTournamentRankings(ctx, {
    tournamentId: args.tournamentId,
    round: args.round - 1, // Get rankings for previous round
  });
  const activeCompetitors = rankedCompetitors.filter(({ id }) => !!competitors.find((c) => c._id === id && c.active));
  if (args.method === 'adjacent') {
    return generateDraftAdjacentPairings(activeCompetitors);
  }
  if (args.method === 'random') {
    return generateDraftRandomPairings(activeCompetitors);
  }
  return {
    pairings: [],
    unpairedCompetitors: [],
  };
};
