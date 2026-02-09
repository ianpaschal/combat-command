import { Infer, v } from 'convex/values';

import { api } from '../../../_generated/api';
import { ActionCtx } from '../../../_generated/server';
import { tournamentPairingConfig } from '../../common/tournamentPairingConfig';
import { DeepTournamentCompetitor } from '../../tournamentCompetitors';
import { generateDraftPairings } from '../_helpers/generateDraftPairings';
import { shuffle } from '../_helpers/shuffle';
import { sortByRank } from '../_helpers/sortByRank';
import { sortCompetitorPairs } from '../_helpers/sortCompetitorPairs';
import { uniqueFields } from '../table';

export const draftTournamentPairing = v.object(uniqueFields);
export type DraftTournamentPairing = Infer<typeof draftTournamentPairing>;

export const generateDraftTournamentPairingsArgs = v.object({
  tournamentId: v.id('tournaments'),
  round: v.number(),
  config: tournamentPairingConfig,
});

export const generateDraftTournamentPairings = async (
  ctx: ActionCtx,
  args: Infer<typeof generateDraftTournamentPairingsArgs>,
): Promise<DraftTournamentPairing[]> => {

  const tournamentCompetitors = await ctx.runQuery(
    api.tournamentCompetitors.getTournamentCompetitorsByTournament, {
      tournamentId: args.tournamentId,
    },
  );

  const activeCompetitors = tournamentCompetitors.filter(({ active }) => active);

  const orderedCompetitors: DeepTournamentCompetitor[] = [];
  if (args.config.orderBy === 'ranking') {
    orderedCompetitors.push(...sortByRank(activeCompetitors));
  }
  if (args.config.orderBy === 'random') {
    orderedCompetitors.push(...shuffle(activeCompetitors));
  }

  return generateDraftPairings(orderedCompetitors, args.config.policies).sort(sortCompetitorPairs).map((draftPairing) => ({
    tournamentCompetitor0Id: draftPairing[0]._id,
    tournamentCompetitor1Id: draftPairing[1]?._id ?? null,
    table: -1,
  }));
};
