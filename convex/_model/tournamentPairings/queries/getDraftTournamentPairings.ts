import { TournamentPairingMethod } from '@ianpaschal/combat-command-game-systems/common';
import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getStaticEnumConvexValidator } from '../../common/_helpers/getStaticEnumConvexValidator';
import { TournamentCompetitorRanked } from '../../common/types';
import { getTournamentCompetitorsByTournament } from '../../tournamentCompetitors';
import { getTournamentRankings } from '../../tournaments';
import { generateDraftPairings } from '../_helpers/generateDraftPairings';
import { shuffle } from '../_helpers/shuffle';
import { sortByRank } from '../_helpers/sortByRank';
import { sortCompetitorPairs } from '../_helpers/sortCompetitorPairs';
import { uniqueFields } from '../table';

const draftTournamentPairing = v.object(uniqueFields);
export type DraftTournamentPairing = Infer<typeof draftTournamentPairing>;
const tournamentPairingMethod = getStaticEnumConvexValidator(TournamentPairingMethod);

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
  const competitors = await getTournamentCompetitorsByTournament(ctx, args);
  const { competitors: rankedCompetitors } = await getTournamentRankings(ctx, {
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
    tournamentId: args.tournamentId,
    tournamentCompetitor0Id: draftPairing[0].id,
    tournamentCompetitor1Id: draftPairing[1]?.id ?? null,
    table: -1,
    round: args.round,
  }));
};
