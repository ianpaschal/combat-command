import { ConvexError } from 'convex/values';

import { getErrorMessage } from '../../../common/errors';
import { ResultData } from '../types';

export function averageResults(results: ResultData, denominator: number) {
  if (denominator === 0) {
    throw new ConvexError(getErrorMessage('TOURNAMENT_RANKINGS_AVERAGE_0_DENOMINATOR'));
  }
  // TODO: Throw error for denominator === 0
  return Object.entries(results).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value / denominator,
  }), {} as ResultData);
}
