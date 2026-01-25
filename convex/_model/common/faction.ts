import { Faction as flamesOfWarV4 } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { Faction as teamYankeeV2 } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import { v } from 'convex/values';

export type Faction = `${flamesOfWarV4}` | `${teamYankeeV2}`;

const values: Faction[] = [
  ...Object.values(flamesOfWarV4),
  ...Object.values(teamYankeeV2),
];

export const faction = v.union(
  ...values.map((item) => v.literal(item)),
);
