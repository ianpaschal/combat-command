import { TournamentPairingMethod } from '@ianpaschal/combat-command-static-data/common';
import { Infer, v } from 'convex/values';

import { api } from '../../../_generated/api';
import { ActionCtx } from '../../../_generated/server';
import { getStaticEnumConvexValidator } from '../../common/_helpers/getStaticEnumConvexValidator';
import { TournamentCompetitorRanked } from '../../tournaments';
import { generateDraftPairings } from '../_helpers/generateDraftPairings';
import { shuffle } from '../_helpers/shuffle';
import { sortByRank } from '../_helpers/sortByRank';
import { sortCompetitorPairs } from '../_helpers/sortCompetitorPairs';
import { uniqueFields } from '../table';

const draftTournamentPairing = v.object(uniqueFields);
export type DraftTournamentPairing = Infer<typeof draftTournamentPairing>;
const tournamentPairingMethod = getStaticEnumConvexValidator(TournamentPairingMethod);

export const generateDraftTournamentPairingsArgs = v.object({
  method: tournamentPairingMethod,
  round: v.number(),
  tournamentId: v.id('tournaments'),
});

/**
 * Generates a DraftTournamentPairings object.
 * 
 * @param ctx - Convex action context
 * @param args - Convex action args
 * @param args.method - The pairing method to use
 * @param args.round - The upcoming round index which the generated pairing are for
 * @param args.tournamentId - ID of the Tournament
 * @returns An array of DraftTournamentPairings
 */
export const generateDraftTournamentPairings = async (
  ctx: ActionCtx,
  args: Infer<typeof generateDraftTournamentPairingsArgs>,
): Promise<DraftTournamentPairing[]> => {
  // TODO: Consolidate these into one call:
  const competitors = await ctx.runQuery(api.tournamentCompetitors.getTournamentCompetitorsByTournament, {
    tournamentId: args.tournamentId,
  });
  const { competitors: rankedCompetitors } = await ctx.runQuery(api.tournaments.getTournamentRankings, {
    tournamentId: args.tournamentId,
    round: args.round - 1, // Get rankings for previous round
  });
  const activeCompetitors = rankedCompetitors.filter(({ id }) => (
    !!competitors.find((c) => c._id === id && c.active)
  ));
  const orderedCompetitors: TournamentCompetitorRanked[] = [];
  if (args.method === 'adjacent') {
    orderedCompetitors.push(...sortByRank(activeCompetitors));
  }
  if (args.method === 'random') {
    orderedCompetitors.push(...shuffle(activeCompetitors));
  }
  return generateDraftPairings(orderedCompetitors).sort(sortCompetitorPairs).map((draftPairing) => ({
    tournamentCompetitor0Id: draftPairing[0].id,
    tournamentCompetitor1Id: draftPairing[1]?.id ?? null,
    table: -1,
  }));
};
