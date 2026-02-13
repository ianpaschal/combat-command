import { Infer, v } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { getDocStrict } from '../../common/_helpers/getDocStrict';
import { editableFields } from '../table';

export const createListArgs = v.object(editableFields);

export const createList = async (
  ctx: MutationCtx,
  args: Infer<typeof createListArgs>,
): Promise<Id<'lists'>> => {

  let computedFields = {
    locked: false,
    approved: true,
  };

  if (args.tournamentRegistrationId) {
    const tournamentRegistration = await getDocStrict(ctx, args.tournamentRegistrationId);
    const tournament = await getDocStrict(ctx, tournamentRegistration.tournamentId);
    computedFields = {
      locked: Date.now() > tournament.listSubmissionClosesAt,
      approved: false,
    };
  }

  return await ctx.db.insert('lists', {
    ...args,
    ...computedFields,
  });
};
