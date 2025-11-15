import { Infer, v } from 'convex/values';

import { MutationCtx } from '../../../_generated/server';
import { extractSearchTokens as extractTournamentSearchTokens } from '../../tournaments/_helpers/extractSearchTokens';
import { extractSearchTokens as extractUserSearchTokens } from '../../users/_helpers/extractSearchTokens';

export const refreshSearchIndexArgs = v.object({
  tableName: v.union(
    v.literal('tournaments'),
    v.literal('users'),
  ),
});

export const refreshSearchIndex = async (
  ctx: MutationCtx,
  { tableName }: Infer<typeof refreshSearchIndexArgs>,
): Promise<void> => {
  if (tableName === 'tournaments') {
    const rows = await ctx.db.query('tournaments').collect();
    for (const row of rows) {
      await ctx.db.patch(row._id, {
        search: extractTournamentSearchTokens(row),
      });
    }
  } else if (tableName === 'users') {
    const rows = await ctx.db.query('users').collect();
    for (const row of rows) {
      await ctx.db.patch(row._id, {
        search: extractUserSearchTokens(row),
      });
    }
  }
};
