import { matchResultDetails as flamesOfWarV4 } from '@ianpaschal/combat-command-game-systems/flamesOfWarV4';
import { matchResultDetails as teamYankeeV2 } from '@ianpaschal/combat-command-game-systems/teamYankeeV2';
import { z } from 'zod';

export const matchResultDetails = z.union([
  flamesOfWarV4.schema,
  teamYankeeV2.schema,
]);

export type MatchResultDetails = z.infer<typeof matchResultDetails>;
