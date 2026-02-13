import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { editableFields } from '../table';

export const updateListArgs = v.object({
  _id: v.id('lists'),
  ...editableFields,
  approved: v.boolean(),
});

export const updateList = async (
  ctx: MutationCtx,
  args: Infer<typeof updateListArgs>,
): Promise<void> => {

  const { _id: id, ...updated } = args;

  // let computedFields = {
  //   locked: false,
  //   approved: true,
  // };

  // if (args.tournamentRegistrationId) {
  //   const tournamentRegistration = await getDocStrict(ctx, args.tournamentRegistrationId);
  //   const tournament = await getDocStrict(ctx, tournamentRegistration.tournamentId);
  //   computedFields = {
  //     locked: Date.now() > tournament.listSubmissionClosesAt,
  //     approved: false,
  //   };
  // }

  // TODO: Do not allow approved change if not a TO
  // TODO: Do not allow any changes if locked

  return await ctx.db.patch(id, {
    ...updated,
    modifiedAt: Date.now(),
  });
};
