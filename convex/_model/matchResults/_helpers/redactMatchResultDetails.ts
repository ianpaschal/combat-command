import { getMissionDisplayName } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';

import { Doc } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { calculateFowV4MatchResultScore } from '../../fowV4/calculateFowV4MatchResultScore';
import { checkMatchResultDetailsVisibility } from './checkMatchResultDetailsVisibility';

export type LimitedMatchResultDetails = Partial<Doc<'matchResults'>['details']> & {
  missionName?: string;
  player0Score: number;
  player1Score: number;
};

export const redactMatchResultDetails = async (
  ctx: QueryCtx,
  doc: Doc<'matchResults'>,
): Promise<LimitedMatchResultDetails> => {
  const visible = await checkMatchResultDetailsVisibility(ctx, doc);

  // TODO: This is FowV4 specific, needs to be made generic!
  const [player0Score, player1Score] = calculateFowV4MatchResultScore(doc.details);

  return {
    ...(visible ? {
      ...doc.details,
      missionName: getMissionDisplayName(doc.details.mission),
    }: {}),
    player0Score,
    player1Score,
  };
};
