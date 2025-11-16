import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getDocStrict } from '../../common/_helpers/getDocStrict';
import { checkUsersAreTeammates } from '../../tournamentCompetitors/_helpers/checkUsersAreTeammates';
import { checkUserIsTournamentOrganizer } from '../../tournamentOrganizers';

export const checkListVisibility = async (
  ctx: QueryCtx,
  doc: Doc<'lists'>,
): Promise<boolean> => {
  const userId = await getAuthUserId(ctx);
  const tournamentRegistration = await getDocStrict(ctx, doc.tournamentRegistrationId);  
  const tournament = await getDocStrict(ctx, tournamentRegistration.tournamentId);
  const isOrganizer = await checkUserIsTournamentOrganizer(ctx, tournament._id, userId);
  const isTeammate = await checkUsersAreTeammates(ctx, tournamentRegistration.userId, userId);

  if (isOrganizer || isTeammate || tournament.listsRevealed) {
    return true;
  }

  return false;
};
