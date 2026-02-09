import { tournamentPairingConfig as config } from '@ianpaschal/combat-command-game-systems/common';
import { zodToConvex } from 'convex-helpers/server/zod';

export const tournamentPairingConfig = zodToConvex(config.schema);
