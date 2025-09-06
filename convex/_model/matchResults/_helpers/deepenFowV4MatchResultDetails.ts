import { getMissionDisplayName } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { Doc } from '../../../_generated/dataModel';

/**
 * Flames of War v4 match result with additional computed fields.
 */
export type DeepFowV4MatchResultDetails = ReturnType<typeof deepenFowV4MatchResultDetails>;

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Deepens a Flames of War v4 match result by adding computed fields.
 * 
 * @remarks
 * This method's return type is, by nature, the definition of deep Flames of War v4 match result details.
 * 
 * @param ctx - Convex query context
 * @param doc - Raw match result document
 * @returns A deep match result
 */
export const deepenFowV4MatchResultDetails = (
  doc: Doc<'matchResults'>['details'],
) => {
  const missionName = getMissionDisplayName(doc.mission);
  return { 
    ...doc,
    ...(missionName ? { missionName } : {}),
  };
};
