import { Doc } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
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
    return {
      active,
      user: user ? {
        ...await redactUserInfo(ctx, user),
        avatarUrl,
      } : null,
    };
  }));
  return {
    ...tournamentCompetitor,
    players,
  };
};
