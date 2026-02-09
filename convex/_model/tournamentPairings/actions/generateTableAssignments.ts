import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { api } from '../../../_generated/api';
import { ActionCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { assignTables } from '../_helpers/assignTables';
import { DraftTournamentPairing, draftTournamentPairing } from './generateDraftTournamentPairings';

export const generateTableAssignmentsArgs = v.object({
  tournamentId: v.id('tournaments'),
  pairings: v.array(draftTournamentPairing),
});

// NOTE: This is not round specific. It always uses the latest set of playedTables.
export const generateTableAssignments = async (
  ctx: ActionCtx,
  args: Infer<typeof generateTableAssignmentsArgs>,
): Promise<DraftTournamentPairing[]> => {

  const tournament = await ctx.runQuery(
    api.tournaments.getTournament, {
      id: args.tournamentId,
    },
  );

  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }

  const tournamentCompetitors = await ctx.runQuery(
    api.tournamentCompetitors.getTournamentCompetitorsByTournament, {
      tournamentId: args.tournamentId,
    },
  );

  return assignTables(args.pairings, {
    tournament,
    tournamentCompetitors,
  });
};
