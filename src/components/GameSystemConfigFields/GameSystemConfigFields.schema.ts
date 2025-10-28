import { gameSystemConfig as flamesOfWarV4 } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { gameSystemConfig as teamYankeeV2 } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import { z } from 'zod';

export const gameSystemConfig = z.union([
  flamesOfWarV4.schema,
  teamYankeeV2.schema,
]);

export type GameSystemConfig = z.infer<typeof gameSystemConfig>;
