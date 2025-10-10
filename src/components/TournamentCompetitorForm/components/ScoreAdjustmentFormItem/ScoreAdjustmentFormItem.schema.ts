import { rankingFactor as flamesOfWarV4RankingFactor } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { rankingFactor as teamYankeeV2RankingFactor } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import { z } from 'zod';

export const scoreAdjustmentSchema = z.object({
  amount: z.coerce.number(),
  round: z.coerce.number(),
  rankingFactor: z.union([
    flamesOfWarV4RankingFactor,
    teamYankeeV2RankingFactor,
  ], {
    message: 'Please select an ranking factor type.',
  }),
  reason: z.optional(z.string()),
});

export type ScoreAdjustmentFormData = z.infer<typeof scoreAdjustmentSchema>;
