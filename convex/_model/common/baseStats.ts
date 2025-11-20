import { BaseStatKey as FlamesOfWarV4BaseStatKey } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { BaseStatKey as TeamYankeeV2BaseStatKey } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import { v } from 'convex/values';

type ConvexNumber = ReturnType<typeof v.number>;

const createBaseStats = <TStatKeys extends Record<string, string>>(
  statKeys: TStatKeys,
): Record<TStatKeys[keyof TStatKeys], ConvexNumber> => Object.values(statKeys).reduce((acc, key) => ({
  ...acc,
  [key]: v.number(),
}), {} as Record<TStatKeys[keyof TStatKeys], ConvexNumber>);

export const baseStats = v.union(
  v.object(createBaseStats(FlamesOfWarV4BaseStatKey)),
  v.object(createBaseStats(TeamYankeeV2BaseStatKey)),
);
