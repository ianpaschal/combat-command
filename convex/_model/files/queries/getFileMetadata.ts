import { GenericDoc } from '@convex-dev/auth/server';
import { SystemDataModel } from 'convex/server';
import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { QueryCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';

export const getFileMetadataArgs = v.object({
  id: v.id('_storage'),
});

export const getFileMetadata = async (
  ctx: QueryCtx,
  args: Infer<typeof getFileMetadataArgs>,
): Promise<GenericDoc<SystemDataModel,'_storage'> | null> => {
  const fileMetadata = await ctx.db.system.get(args.id);
  if (!fileMetadata) {
    throw new ConvexError(getErrorMessage('FILE_NOT_FOUND'));
  }
  return fileMetadata;
};
