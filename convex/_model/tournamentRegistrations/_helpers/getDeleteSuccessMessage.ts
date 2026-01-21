import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { getDisplayName as getTournamentDisplayName } from '../../tournaments';
import { getUser } from '../../users';

export const getDeleteSuccessMessage = async (
  ctx: MutationCtx,
  tournamentRegistration: Doc<'tournamentRegistrations'> & {
    isLast?: boolean;
    teamName: string;
  },
): Promise<string> => {
  const currentUserId = await getAuthUserId(ctx);
  const user = await getUser(ctx, { id: tournamentRegistration.userId });
  const tournament = await ctx.db.get(tournamentRegistration.tournamentId);

  const isTeamTournament = (tournament?.competitorSize ?? 1) > 1;
  const isSelf = currentUserId && currentUserId === user?._id;

  const tournamentName = getTournamentDisplayName(tournament);
  const userName = user?.displayName ?? 'Unknown User';

  if (isSelf) {
    if (isTeamTournament) {
      if (tournamentRegistration.isLast) {
        return `${tournamentRegistration.teamName} has left ${tournamentName}.`;
      } else {
        return `You have left ${tournamentRegistration.teamName}.`;
      }
    } else {
      return `You have left ${tournamentName}.`;
    }
  } else {
    if (isTeamTournament) {
      if (tournamentRegistration.isLast) {
        return `${tournamentRegistration.teamName} has been removed from ${tournamentName}.`;
      } else {
        return `${userName} has been removed from ${tournamentRegistration.teamName}.`;
      }
    } else {
      return `${userName}} has been removed from ${tournamentName}.`;
    }
  }
};
