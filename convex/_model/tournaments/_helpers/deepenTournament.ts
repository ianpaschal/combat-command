import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';
import { getTournamentNextRound } from './getTournamentNextRound';

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

  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId: tournament._id,
  });
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', tournament._id))
    .collect();
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', tournament._id))
    .collect();

  const playerUserIds = tournamentCompetitors.reduce((acc, c) => [
    ...acc,
    ...c.players.map((p) => p.userId),
  ], [] as Id<'users'>[]);
  const activePlayerUserIds = tournamentCompetitors.reduce((acc, c) => [
    ...acc,
    ...c.players.filter((p) => p.active).map((p) => p.userId),
  ], [] as Id<'users'>[]);

  return {
    ...tournament,
    organizers: tournamentOrganizers,
    activePlayerCount: activePlayerUserIds.length,
    activePlayerUserIds,
    bannerUrl,
    competitorCount: tournamentCompetitors.length,
    logoUrl,
    maxPlayers : tournament.maxCompetitors * tournament.competitorSize,
    nextRound: getTournamentNextRound(tournament),
    playerCount: playerUserIds.length,
    playerUserIds,
    useTeams: tournament.competitorSize > 1,
    nextRound: getTournamentNextRound(tournament),
  };
};

/**
 * Deep Tournament with additional joined data and computed fields.
 */
export type TournamentDeep = Awaited<ReturnType<typeof deepenTournament>>;
