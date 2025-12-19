import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getUser } from '../../users';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const deepenLeagueOrganizer = async (
  ctx: QueryCtx,
  doc: Doc<'leagueOrganizers'>,
) => {
  const user = await getUser(ctx, { id: doc.userId });
  return {
    ...doc,
    user,
  };
};
