import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { intersectArrays } from '../../common/_helpers/intersectArrays';
import { getTournamentUserIds } from '../../tournaments';
import { createOnlyFields,editableFields } from '../fields';

export const createTournamentCompetitorArgs = v.object({
  ...createOnlyFields,
  ...editableFields,
});

export const createTournamentCompetitor = async (
  ctx: MutationCtx,
  args: Infer<typeof createTournamentCompetitorArgs>,
): Promise<Id<'tournamentCompetitors'>> => {
  // --- CHECK AUTH ----
  const userId = await checkAuth(ctx);

  // ---- VALIDATE ----
  const tournament = await ctx.db.get(args.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_MODIFY_ARCHIVED_TOURNAMENT'));
  }
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', args.tournamentId))
    .collect();
  const existingTeamNames = tournamentCompetitors.map((item) => item.teamName);
  if (args.teamName && existingTeamNames.includes(args.teamName)) {
    throw new ConvexError(getErrorMessage('TEAM_ALREADY_IN_TOURNAMENT'));
  }
  const playerUserIds = args.players.map((player) => player.userId);
  const registeredUserIds = await getTournamentUserIds(ctx, args.tournamentId);
  if (!playerUserIds.includes(userId) && !tournament.organizerUserIds.includes(userId)) {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_ANOTHER_PLAYER'));
  }
  if (intersectArrays(registeredUserIds, playerUserIds).length) {
    throw new ConvexError(getErrorMessage('USER_ALREADY_IN_TOURNAMENT'));
  }

  // ---- PRIMARY ACTIONS ----
  return await ctx.db.insert('tournamentCompetitors', {
    ...args,
    active: false,
  });
};
