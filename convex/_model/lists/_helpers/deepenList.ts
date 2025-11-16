/* eslint-disable arrow-body-style */
// import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
// import { ConvexError } from 'convex/values';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
// import { getErrorMessage } from '../../common/errors';
// import { FlamesOfWarV4 } from '../../gameSystems';

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
) => {
  // // TODO-250: Add Team Yankee support here.
  // if (list.gameSystem === GameSystem.FlamesOfWarV4) {
  //   return {
  //     ...list,
  //     data: FlamesOfWarV4.deepenListData(list.data),
  //   };
  // }

  // if (list.gameSystem === GameSystem.TeamYankeeV2) {
  //   return {
  //     ...list,
  //     data: TeamYankeeV2.deepenListData(list.data),
  //   };
  // }
  
  // // If no matcher found, throw an error:
  // throw new ConvexError(getErrorMessage('CANNOT_ADD_ANOTHER_PLAYER'));
  return doc;
};

/**
 * Deep list with additional joined data and computed fields.
 */
export type DeepList = Awaited<ReturnType<typeof deepenList>>;
