import { getAuthUserId } from '@convex-dev/auth/server';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getStorageUrl } from '../../common/_helpers/getStorageUrl';
import { calculateFowV4MatchResultScore } from '../../fowV4/calculateFowV4MatchResultScore';
import { FowV4MatchResultDetails } from '../../fowV4/fowV4MatchResultDetails';
import { getMission } from '../../fowV4/getMission';
import { checkMatchResultDetailsVisibility } from './checkMatchResultDetailsVisibility';

/**
 * User with some personal information hidden based on their preferences.
 */
export type LimitedMatchResultDetails = Partial<Doc<'matchResults'>['details']> & {
  missionName?: string;
  player0Score: number;
  player1Score: number;
};

/**
 * Removes a users's real name or location based on their preferences, also adds avatarUrl.
 * 
 * @remarks
 * This is essentially the user equivalent to the deepen[Resource]() pattern.
 * 
 * @param ctx - Convex query context
 * @param tournament - Raw user document
 * @returns A limited user
 */
export const redactMatchResultDetails = async (
  ctx: QueryCtx,
  doc: Doc<'matchResults'>,
): Promise<LimitedMatchResultDetails> => {
  const shouldRedact = await checkMatchResultDetailsVisibility(ctx, doc);

  const mission = getMission(doc.details.missionId);
  const battlePlansVisible = await checkMatchResultDetailsVisibility(ctx, doc);
  
  // TODO: This is FowV4 specific, needs to be made generic!
  const [player0Score, player1Score] = calculateFowV4MatchResultScore(doc);

  return {
    ...doc.details,
    player0BattlePlan: battlePlansVisible ? doc.details.player0BattlePlan : undefined,
    player1BattlePlan: battlePlansVisible ? doc.details.player1BattlePlan : undefined,
    missionName: mission?.displayName,
    player0Score,
    player1Score,
  };
};
