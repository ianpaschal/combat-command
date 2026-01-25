import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';
import { checkUserIsTournamentOrganizer, getTournamentOrganizersByTournament } from '../../tournamentOrganizers';
import { getAvailableActions } from './getAvailableActions';
import { getDisplayName } from './getDisplayName';
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
  const userId = await getAuthUserId(ctx);
  const logoUrl = await getStorageUrl(ctx, tournament.logoStorageId);
  const bannerUrl = await getStorageUrl(ctx, tournament.bannerStorageId);
  const availableActions = await getAvailableActions(ctx, tournament);
  const tournamentOrganizers = await getTournamentOrganizersByTournament(ctx, {
    tournamentId: tournament._id,
  });
  const isOrganizer = await checkUserIsTournamentOrganizer(ctx, tournament._id, userId);
  const tournamentCompetitors = await ctx.db.query('tournamentCompetitors')
    .withIndex('by_tournament_id', (q) => q.eq('tournamentId', tournament._id))
    .collect();
  const tournamentRegistrations = await ctx.db.query('tournamentRegistrations')
    .withIndex('by_tournament', (q) => q.eq('tournamentId', tournament._id))
    .collect();

  const playerUserIds = tournamentRegistrations.map((r) => r.userId);
  const activePlayerUserIds = tournamentRegistrations.filter((r) => r.active).map((p) => p.userId);

  return {
    ...tournament,
    activePlayerCount: activePlayerUserIds.length,
    activePlayerUserIds,
    alignmentsVisible: isOrganizer || tournament.alignmentsRevealed,
    availableActions,
    bannerUrl,
    competitorCount: tournamentCompetitors.length,
    displayName: getDisplayName(tournament),
    factionsVisible: isOrganizer || tournament.factionsRevealed,
    logoUrl,
    maxPlayers : tournament.maxCompetitors * tournament.competitorSize,
    nextRound: getTournamentNextRound(tournament),
    organizers: tournamentOrganizers,
    playerCount: playerUserIds.length,
    playerUserIds,
    useTeams: tournament.competitorSize > 1,
  };
};

/**
 * Deep Tournament with additional joined data and computed fields.
 */
export type TournamentDeep = Awaited<ReturnType<typeof deepenTournament>>;
