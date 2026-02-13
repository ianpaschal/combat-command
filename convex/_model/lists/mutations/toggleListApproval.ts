import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { getDocStrict } from '../../common/_helpers/getDocStrict';

export const toggleListApprovalArgs = v.object({
  _id: v.id('lists'),
});

export const toggleListApproval = async (
  ctx: MutationCtx,
  args: Infer<typeof toggleListApprovalArgs>,
): Promise<boolean> => {
  const approved = !(await getDocStrict(ctx, args._id)).approved;
  await ctx.db.patch(args._id, {
    approved,
  });
  return approved;
};
