import { RankingFactor } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { z } from 'zod';

export const scoreAdjustmentSchema = z.object({
  amount: z.coerce.number(),
  round: z.coerce.number(),
  rankingFactor: z.enum(Object.values(RankingFactor) as [RankingFactor, ...RankingFactor[]], {
    message: 'Please select an ranking factor type.',
  }),
  reason: z.optional(z.string()),
});

export type ScoreAdjustmentFormData = z.infer<typeof scoreAdjustmentSchema>;
