import { Infer, v } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { checkAuth } from '../../common/_helpers/checkAuth';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';
import { getTournamentPairingDeep } from '../../tournamentPairings';
import { getTournamentShallow } from '../../tournaments';
import { editableFields } from '../fields';

export const createMatchResultArgs = v.object({
  ...editableFields,
});

export type CreateMatchResultArgs = Infer<typeof createMatchResultArgs>;

/**
 * Creates a new match result.
 * 
 * @param ctx - Convex query context
 * @param args - Match result data
 * @returns ID of the newly created match result
 */
export const createMatchResult = async (
  ctx: MutationCtx,
  args: CreateMatchResultArgs,
): Promise<Id<'matchResults'>> => {
  const userId = await checkAuth(ctx);

  let tournamentId: Id<'tournaments'> | undefined = undefined;

  // ---- CHECK ELIGIBILITY ----
  if (args.tournamentPairingId) {
    // Perform tournament-based auth checks for matches with a tournament pairing:
    const tournamentPairing = await getTournamentPairingDeep(ctx, args.tournamentPairingId);
    const tournament = await getTournamentShallow(ctx, tournamentPairing.tournamentId);

    // Add computed value:
    tournamentId = tournament._id;

    const isPlayerInPairing = tournamentPairing.playerUserIds.includes(userId);
    const isTournamentOrganizer = await checkUserIsTournamentOrganizer(ctx, tournament._id, userId);
    if (!isPlayerInPairing && !isTournamentOrganizer ) {
      // TODO: Convert to proper Convex error message:
      throw 'You do not have permission to do that.';
    }

    const player0AlreadySubmitted = args.player0UserId && tournamentPairing.submittedUserIds.includes(args.player0UserId);
    const player1AlreadySubmitted = args.player1UserId && tournamentPairing.submittedUserIds.includes(args.player1UserId);
    if (player0AlreadySubmitted || player1AlreadySubmitted) {
      // TODO: Convert to proper Convex error message:
      throw 'One or more players have already submitted their match result for this pairing!';
    }

  } else {
    // Perform basic auth checks for single matches:
    if (userId !== args.player0UserId && !args.tournamentPairingId) {
      // TODO: Convert to proper Convex error message:
      throw 'Cannot add match as another user.';
    }
  }
 
  // ---- CHECK VALIDITY ----
  if (!args.player1UserId && !args.player1Placeholder) {
    // TODO: Convert to proper Convex error message:
    throw 'Match result must include reference to another user or a placeholder.';
  }
  // TODO: Validate: Check that details match game system config

  // ---- PRIMARY ACTIONS ----
  // Create the match result:
  return await ctx.db.insert('matchResults', {
    ...args,
    tournamentId,
    player0Confirmed: true, // TODO: Default to false, require users to approve
    player1Confirmed: true, // TODO: Default to false, require users to approve
  });
};
