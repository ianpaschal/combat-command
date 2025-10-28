import { v } from 'convex/values';

import { rankingFactor } from './rankingFactor';

export const scoreAdjustment = v.object({
  amount: v.number(),
  round: v.number(),
  rankingFactor,
  reason: v.optional(v.string()),
});
