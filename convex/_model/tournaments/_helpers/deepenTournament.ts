import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a Tournament by joining additional relevant data and adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep Tournament.
 * 
 * @param ctx - Convex query context
 * @param tournament - Raw Tournament document
 * @returns A deep Tournament
 */
export const deepenTournament = async (
  ctx: QueryCtx,
  tournament: Doc<'tournaments'>,
) => {
  const logoUrl = await getStorageUrl(ctx, tournament.logoStorageId);
  const bannerUrl = await getStorageUrl(ctx, tournament.bannerStorageId);

  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors').withIndex(
    'by_tournament_id',
    (q) => q.eq('tournamentId', tournament._id),
  ).collect();
  const competitorCount = tournamentCompetitors.length;

  const playerUserIds = tournamentCompetitors.reduce((acc, c) => [
    ...acc,
    ...c.players.map((p) => p.userId),
  ], [] as Id<'users'>[]);
  const activePlayerUserIds = tournamentCompetitors.reduce((acc, c) => [
    ...acc,
    ...c.players.filter((p) => p.active).map((p) => p.userId),
  ], [] as Id<'users'>[]);

  // Computed properties (easy to do, but used so frequently, it's nice to include them by default)
  const playerCount = playerUserIds.length;
  const activePlayerCount = activePlayerUserIds.length;
  const maxPlayers = tournament.maxCompetitors * tournament.competitorSize;
  const useTeams = tournament.competitorSize > 1;

  return {
    ...tournament,
    logoUrl,
    bannerUrl,
    competitorCount,
    activePlayerCount,
    playerCount,
    playerUserIds,
    activePlayerUserIds,
    maxPlayers,
    useTeams,
  };
};

/**
 * Deep Tournament with additional joined data and computed fields.
 */
export type TournamentDeep = Awaited<ReturnType<typeof deepenTournament>>;
