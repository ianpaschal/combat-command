import { createUserData, userEmails } from './_helpers/testUsers';
import { MutationCtx } from '../../_generated/server';

export const createTestUsers = async (
  ctx: MutationCtx,
): Promise<void> => {
  for (const email of userEmails) {
    await ctx.db.insert('users', createUserData(email));
  }
};
