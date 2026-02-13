import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { checkListSubmittedOnTime } from './checkListSubmittedOnTime';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a list by joining additional relevant data and adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of a deep list.
 * 
 * @param ctx - Convex query context
 * @param tournament - Raw list document
 * @returns A deep list
 */
export const deepenList = async (
  ctx: QueryCtx,
  doc: Doc<'lists'>,
) => ({
  ...doc,
  onTime: await checkListSubmittedOnTime(ctx, doc),
});
// FUTURE: Deepen list based on game system

/**
 * Deep list with additional joined data and computed fields.
 */
export type DeepList = Awaited<ReturnType<typeof deepenList>>;
