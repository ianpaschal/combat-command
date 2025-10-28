import { rankingFactors as flamesOfWarV4RankingFactors } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { rankingFactors as teamYankeeV2RankingFactors } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import { v } from 'convex/values';

export const rankingFactor = v.union(
  ...(
    Object.keys(flamesOfWarV4RankingFactors) as (keyof typeof flamesOfWarV4RankingFactors)[]
  ).map((factor) => v.literal(factor)),
  ...(
    Object.keys(teamYankeeV2RankingFactors) as (keyof typeof teamYankeeV2RankingFactors)[]
  ).map((factor) => v.literal(factor)),
);
