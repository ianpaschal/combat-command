import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { getDisplayName as getTournamentCompetitorDisplayName } from '../../tournamentCompetitors';
import { getDisplayName as getTournamentDisplayName } from '../../tournaments';
import { getUser } from '../../users';

export const getCreateSuccessMessage = async (
  ctx: MutationCtx,
  doc: Doc<'tournamentRegistrations'>,
): Promise<string> => {
  const currentUserId = await getAuthUserId(ctx);
  const user = await getUser(ctx, { id: doc.userId });
  const tournament = await ctx.db.get(doc.tournamentId);
  const tournamentCompetitor = await ctx.db.get(doc.tournamentCompetitorId);

  const isTeamTournament = (tournament?.competitorSize ?? 1) > 1;
  const isSelf = currentUserId && currentUserId === user?._id;

  const tournamentName = getTournamentDisplayName(tournament);
  const teamName = await getTournamentCompetitorDisplayName(ctx, tournamentCompetitor);
  const userName = user?.displayName ?? 'Unknown User';

  if (isSelf) {
    if (isTeamTournament) {
      return `You have joined ${tournamentName} on ${teamName}!`;
    } else {
      return `You have joined ${tournamentName}!`;
    }
  } else {
    if (isTeamTournament) {
      return `${userName} has been added to ${tournamentName} on ${teamName}!`;
    } else {
      return `${userName} has been added to ${tournamentName}!`;
    }
  }
};
