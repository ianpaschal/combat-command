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

type ConvexNumber = ReturnType<typeof v.number>;

const createRankingFactorValues = <TRankingFactors extends Record<string, object>>(
  rankingFactors: TRankingFactors,
): Record<keyof TRankingFactors, ConvexNumber> => (Object.keys(rankingFactors) as (keyof TRankingFactors)[]).reduce((acc, key) => ({
  ...acc,
  [key]: v.number(),
}), {} as Record<keyof TRankingFactors, ConvexNumber>);

export const rankingFactorValues = v.union(
  v.object(createRankingFactorValues(flamesOfWarV4RankingFactors)),
  v.object(createRankingFactorValues(teamYankeeV2RankingFactors)),
);
