import { Alignment as flamesOfWarV4 } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { Alignment as teamYankeeV2 } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import { v } from 'convex/values';

export type Alignment = `${flamesOfWarV4}` | `${teamYankeeV2}`;

const values: Alignment[] = [
  ...Object.values(flamesOfWarV4),
  ...Object.values(teamYankeeV2),
];

export const alignment = v.union(
  ...values.map((item) => v.literal(item)),
);
