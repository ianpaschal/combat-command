import { FlamesOfWarV4, TeamYankeeV2 } from '@ianpaschal/combat-command-game-systems';
import { v } from 'convex/values';
import { zodToConvex } from 'convex-helpers/server/zod';

// import { gameSystemConfig as flamesOfWarGameSystemConfigOld } from '../gameSystems/battlefront/flamesOfWarV4';

export const gameSystemConfig = v.union(
  zodToConvex(FlamesOfWarV4.gameSystemConfig.schema),
  zodToConvex(TeamYankeeV2.gameSystemConfig.schema),

  // TODO - MIGRATION: REMOVE AFTER MIGRATING:
  // flamesOfWarGameSystemConfigOld,
);
