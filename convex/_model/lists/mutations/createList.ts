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

export const createList = async (
  ctx: MutationCtx,
  args: Infer<typeof createListArgs>,
): Promise<Id<'lists'>> => {
  const tournamentRegistration = await ctx.db.get(args.tournamentRegistrationId);
  if (!tournamentRegistration) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_REGISTRATION_NOT_FOUND'));
  }
  const existingLists = await ctx.db.query('lists')
    .withIndex('by_tournament_registration', (q) => q.eq('tournamentRegistrationId', args.tournamentRegistrationId))
    .collect();
  const tournament = await ctx.db.get(tournamentRegistration.tournamentId);
  if (!tournament) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_NOT_FOUND'));
  }
  const { listSubmissionClosesAt } = tournament;

  return await ctx.db.insert('lists', {
    ...args,
    locked: Date.now() > listSubmissionClosesAt,
    primary: existingLists.length === 0,
  });
};
