import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { checkMatchResultDetailsVisibility } from './checkMatchResultDetailsVisibility';

/**
 * Flames of War v4 match result with additional computed fields.
 */
export type DeepMatchResultDetails = ReturnType<typeof deepenMatchResultDetails>;

/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const deepenMatchResultDetails = async (
  ctx: QueryCtx,
  doc: Doc<'matchResults'>,
) => {
  const showDetails = await checkMatchResultDetailsVisibility(ctx, doc);
  if (!showDetails) {
    return undefined;
  }
  return doc.details;
};
