import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';
import { getTournamentCompetitorsByTournament } from '../../tournamentCompetitors';
import { getTournamentPairings } from '../../tournamentPairings';
import { checkTournamentAuth, getTournamentShallow } from '../../tournaments';
import { sharedFields, uniqueFields } from '../fields';

export const createTournamentPairingsArgs = v.object({
  ...sharedFields,
  pairings: v.array(v.object({
    ...uniqueFields,
  })),
});

export const createTournamentPairings = async (
  ctx: MutationCtx,
  args: Infer<typeof createTournamentPairingsArgs>,
): Promise<Id<'tournamentPairings'>[]> => {
  const tournament = await getTournamentShallow(ctx, args.tournamentId);
  const competitors = await getTournamentCompetitorsByTournament(ctx, {
    tournamentId: args.tournamentId,
  });
  const existingPairings = await getTournamentPairings(ctx, {
    tournamentId: args.tournamentId,
    round: args.round,
  });

  // --- CHECK AUTH ----
  checkTournamentAuth(ctx, tournament);

  // ---- VALIDATE ----
  if (tournament.status === 'draft') {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRINGS_TO_DRAFT_TOURNAMENT'));
  }
  if (tournament.status === 'published') {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRINGS_TO_PUBLISHED_TOURNAMENT'));
  }
  if (tournament.status === 'archived') {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRINGS_TO_ARCHIVED_TOURNAMENT'));
  }
  if (tournament.currentRound !== undefined) {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRINGS_TO_IN_PROGRESS_ROUND'));
  }
  if (existingPairings.length) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_ALREADY_HAS_PAIRINGS_FOR_ROUND'));
  }
  if (!args.pairings.length) {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_EMPTY_PAIRINGS_LIST'));
  }
  if (args.pairings.length > Math.ceil(tournament.maxCompetitors / 2)) {
    throw new ConvexError(getErrorMessage('CANNOT_ADD_TOO_MANY_PAIRINGS'));
  }

  const pairingIds: Id<'tournamentPairings'>[] = [];
  const pairedCompetitorIds = new Set<Id<'tournamentCompetitors'>>();

  for (const pairing of args.pairings) {

    // ---- VALIDATE EACH PAIRING ----
    for (const id of [pairing.tournamentCompetitor0Id, pairing.tournamentCompetitor1Id]) {
      const competitor = competitors.find((c) => c._id === id);
      const activePlayers = (competitor?.players ?? []).filter((p) => p.active);
      if (id !== null) {
        if (!competitor) {
          throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRING_FOR_MISSING_COMPETITOR'));
        }
        if (!competitor?.active) {
          throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRING_FOR_INACTIVE_COMPETITOR'));
        }
        if (pairedCompetitorIds.has(pairing.tournamentCompetitor0Id)) {
          throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRING_FOR_ALREADY_PAIRED_COMPETITOR'));
        }
        if (activePlayers.length < tournament.competitorSize) {
          throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRING_FOR_UNDER_STRENGTH_COMPETITOR'));
        }
        if (activePlayers.length > tournament.competitorSize) {
          throw new ConvexError(getErrorMessage('CANNOT_ADD_PAIRING_FOR_OVER_STRENGTH_COMPETITOR'));
        }
      }
    }

    // ---- PRIMARY ACTIONS ----
    const id = await ctx.db.insert('tournamentPairings', {
      ...pairing,
      tournamentId: args.tournamentId,
      round: args.round,
    });

    // ---- TRACK RESULTS ----
    pairingIds.push(id);
    pairedCompetitorIds.add(pairing.tournamentCompetitor0Id);
    if (pairing.tournamentCompetitor1Id) {
      pairedCompetitorIds.add(pairing.tournamentCompetitor1Id);
    }
  }
  
  // TODO: Throw error if tables are double-assigned
  // TODO: Throw error if competitors are double-assigned

  return pairingIds;
};
