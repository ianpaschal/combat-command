import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { redactUserInfo } from '../../../users/utils/redactUserInfo';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a tournament competitor by joining additional relevant data and adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep tournament competitor.
 * 
 * @param ctx - Convex query context
 * @param tournament - Raw tournament competitor document
 * @returns A deep tournament competitor
 */
export const deepenTournamentCompetitor = async (
  ctx: QueryCtx,
  tournamentCompetitor: Doc<'tournamentCompetitors'>,
) => {
  const players = await Promise.all(tournamentCompetitor.players.map(async ({ active, userId }) => {
    // TODO: Replace with proper user helper
    const user = await ctx.db.get(userId);
    if (!user) {
      return {
        active,
        user: null,
      };
    }
    const avatarUrl = await getStorageUrl(ctx, user.avatarStorageId);
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

/**
 * Tournament competitor with additional joined data and computed fields.
 */
export type DeepTournamentCompetitor = Awaited<ReturnType<typeof deepenTournamentCompetitor>>;
