import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { tournamentPairingMethod } from '../../../static/tournamentPairingMethods';
import { getTournamentCompetitorListByTournamentId } from '../../tournamentCompetitors';
import { getTournamentRankings } from '../../tournaments';
import { generateDraftPairings } from '../_helpers/generateDraftPairings';
import { DraftTournamentPairing } from '../_helpers/generateDraftPairings';
import { shuffle } from '../_helpers/shuffle';
import { sortByRank } from '../_helpers/sortByRank';

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
 * @returns An array of DraftTournamentPairings
 */
export const getDraftTournamentPairings = async (
  ctx: QueryCtx,
  args: Infer<typeof getDraftTournamentPairingsArgs>,
): Promise<DraftTournamentPairing[]> => {
  const competitors = await getTournamentCompetitorListByTournamentId(ctx, args);
  const { competitors: rankedCompetitors } = await getTournamentRankings(ctx, {
    tournamentId: args.tournamentId,
    round: args.round - 1, // Get rankings for previous round
  });
  const activeCompetitors = rankedCompetitors.filter(({ id }) => !!competitors.find((c) => c._id === id && c.active));
  if (args.method === 'adjacent') {
    const orderedCompetitors = sortByRank(activeCompetitors);
    return generateDraftPairings(orderedCompetitors);
  }
  if (args.method === 'random') {
    const orderedCompetitors = shuffle(activeCompetitors);
    return generateDraftPairings(orderedCompetitors);
  }
  return [];
};
