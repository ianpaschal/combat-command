import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { LimitedUser } from '../../users/_helpers/redactUser';
import { getUser } from '../../users/queries/getUser';

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
  const players = await Promise.all(tournamentCompetitor.players.map(async ({ active, userId }) => ({
    active,
    user: await getUser(ctx, { id: userId }),
  })));

  function playerHasUser(player: { active: boolean; user: LimitedUser | null }): player is { active: boolean; user: LimitedUser } {
    return player.user !== null;
  }
  
  return {
    ...tournamentCompetitor,
    players: players.filter(playerHasUser),
  };
};

/**
 * Tournament competitor with additional joined data and computed fields.
 */
export type DeepTournamentCompetitor = Awaited<ReturnType<typeof deepenTournamentCompetitor>>;
