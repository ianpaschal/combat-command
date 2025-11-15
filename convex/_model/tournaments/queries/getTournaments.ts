import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { Infer, v } from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { buildFilteredQuery } from '../../common/_helpers/buildFilteredQuery';
import { getStaticEnumConvexValidator } from '../../common/_helpers/getStaticEnumConvexValidator';
import { notNullOrUndefined } from '../../common/_helpers/notNullOrUndefined';
import { tournamentStatus } from '../../common/tournamentStatus';
import { checkTournamentVisibility } from '../_helpers/checkTournamentVisibility';
import { deepenTournament, TournamentDeep } from '../_helpers/deepenTournament';
import { getTournamentsByUser } from './getTournamentsByUser';

const gameSystem = getStaticEnumConvexValidator(GameSystem);

export const getTournamentsArgs = v.object({
  status: v.optional(v.array(tournamentStatus)),
  gameSystem: v.optional(v.array(gameSystem)),
  userId: v.optional(v.id('users')),
  search: v.optional(v.string()),
  order: v.optional(v.union(v.literal('asc'), v.literal('desc'))),
});

/**
 * Gets an array of deep Tournaments.
 * 
 * @param ctx - Convex query context
 * @param args - Convex query args
 * @param args.startsAfter - Filter for tournaments starting after this date
 * @returns An array of deep Tournaments
 */
export const getTournaments = async (
  ctx: QueryCtx,
  args?: Infer<typeof getTournamentsArgs>,
): Promise<TournamentDeep[]> => {

  /* By user is handled a bit differently as it's not a field on the records so there's no index or
   * filter for it.
   */
  if (args?.userId) {
    //@ts-expect-error This is safe.
    return await getTournamentsByUser(ctx, args);
  }

  const query = buildFilteredQuery(ctx, {
    table: 'tournaments',
    filterIndex: 'by_starts_at',
    searchIndex: 'search',
  }, args);

  // TODO: Pagination:
  const tournaments = await query.collect();

  const deepTournaments = await Promise.all(tournaments.map(async (tournament) => {
    if (await checkTournamentVisibility(ctx, tournament)) {
      return await deepenTournament(ctx, tournament);
    }
    return null;
  }));
  return deepTournaments.filter(notNullOrUndefined);
};
