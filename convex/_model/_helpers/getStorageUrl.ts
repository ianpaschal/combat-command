import { Id } from '../../_generated/dataModel';
import { QueryCtx } from '../../_generated/server';

export const getStorageUrl = async (ctx: QueryCtx, id?: Id<'_storage'> | null): Promise<string | undefined> => {
  if (!id) {
    return undefined;
  }
  const url = await ctx.storage.getUrl(id);
  return url ?? undefined;
};
