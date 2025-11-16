import {
  ConvexError,
  Infer,
  v,
} from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { MutationCtx } from '../../../_generated/server';
import { getErrorMessage } from '../../common/errors';
import { editableFields } from '../table';

// const forceDiagram = getStaticEnumConvexValidator(ForceDiagram);
// const formation = getStaticEnumConvexValidator(Unit);

// const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 6);

export const createListArgs = v.object(editableFields);

// TODO: Auto lock if after deadline

export const createList = async (
  ctx: MutationCtx,
  args: Infer<typeof createListArgs>,
): Promise<Id<'lists'>> => {
  if (!args.tournamentRegistrationId) {
    throw new Error('Tournament registration required!'); // TODO: Remove once required
  }
  const tournamentRegistration = await ctx.db.get(args.tournamentRegistrationId);
  if (!tournamentRegistration) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_REGISTRATION_NOT_FOUND'));
  }
  const tournament = await ctx.db.get(tournamentRegistration.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  const { listSubmissionClosesAt } = tournament;
  return await ctx.db.insert('lists', {
    ...args,
    approvalStatus: null,
    locked: Date.now() > listSubmissionClosesAt,
  });
};
