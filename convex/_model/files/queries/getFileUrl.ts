import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../../common/errors';

export const getFileUrlArgs = v.object({
  id: v.id('_storage'),
});

export const getFileUrl = async (
  ctx: QueryCtx,
  args: Infer<typeof getFileUrlArgs>,
): Promise<string> => {
  const fileUrl = await ctx.storage.getUrl(args.id);
  if (!fileUrl) {
    throw new ConvexError(getErrorMessage('FILE_NOT_FOUND'));
  }
  return fileUrl;
};
