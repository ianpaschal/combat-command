import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc, Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';
import { getStorageUrl } from '../_helpers/getStorageUrl';
import { getTournamentCompetitorsByTournamentId } from '../tournamentCompetitors/helpers';

export const getDeepTournament = async (
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
  const maxPlayers = tournament.maxCompetitors * tournament.competitorSize;
  const useTeams = tournament.competitorSize > 1;

  // const organizerUsers = [];

  // Restrict visibility of draft tournaments:
  const userId = await getAuthUserId(ctx);
  if (tournament.status === 'draft' && (!userId || !tournament.organizerUserIds.includes(userId))) {
    return null;
  }

  return {
    ...tournament,
    logoUrl,
    bannerUrl,
    competitorCount,
    playerCount,
    playerUserIds,
    activePlayerUserIds,
    maxPlayers,
    useTeams,
  };
};

export const getTournamentUserIds = async (
  ctx: QueryCtx,
  id: Id<'tournaments'>,
) => {
  const tournamentCompetitors = await getTournamentCompetitorsByTournamentId(ctx, id);
  return new Set(tournamentCompetitors.reduce((acc, c) => [
    ...acc,
    ...c.players.map((p) => p.userId),
  ], [] as Id<'users'>[]));
};
