import { ConvexError } from 'convex/values';

import { Doc, Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { redactUserInfo } from '../../users/utils/redactUserInfo';
import { getStorageUrl } from '../_helpers/getStorageUrl';

export const getDeepTournamentCompetitor = async (
  ctx: QueryCtx,
  tournamentCompetitor: Doc<'tournamentCompetitors'>,
) => {
  const players = await Promise.all(tournamentCompetitor.players.map(async ({ active, userId }) => {
    // TODO: Replace with proper user helper
    const user = await ctx.db.get(userId);
    const avatarUrl = user ? await getStorageUrl(ctx, user.avatarStorageId) : undefined;
    if (!user) {
      throw new ConvexError(getErrorMessage('USER_NOT_FOUND'));
    }
    return {
      active,
      user: {
        ...await redactUserInfo(ctx, user),
        avatarUrl,
      },
    };
  }));
  return {
    ...tournamentCompetitor,
    players: players.filter((player) => !!player.user),
  };
};

export const getTournamentCompetitorsByTournamentId = async (
  ctx: QueryCtx,
  id: Id<'tournaments'>,
) => await ctx.db.query('tournamentCompetitors')
  .withIndex('by_tournament_id', (q) => q.eq('tournamentId', id))
  .collect();
