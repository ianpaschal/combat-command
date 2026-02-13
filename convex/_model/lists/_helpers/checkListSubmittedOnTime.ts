import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getDocStrict } from '../../common/_helpers/getDocStrict';

export const checkListSubmittedOnTime = async (
  ctx: QueryCtx,
  doc: Doc<'lists'>,
): Promise<boolean> => {
  if (doc.tournamentRegistrationId) {
    const tournamentRegistration = await getDocStrict(ctx, doc.tournamentRegistrationId);  
    const tournament = await getDocStrict(ctx, tournamentRegistration.tournamentId);
    if (doc._creationTime < tournament.listSubmissionClosesAt) {
      return true;
    }
    return false;
  }
  return true;
}; 
