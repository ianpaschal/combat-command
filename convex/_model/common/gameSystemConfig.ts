import { FlamesOfWarV4, TeamYankeeV2 } from '@ianpaschal/combat-command-game-systems';
import { v } from 'convex/values';
import { zodToConvex } from 'convex-helpers/server/zod';
import z from 'zod';

export const gameSystemConfig = v.union(
  // TODO - MIGRATION: REMOVE AFTER MIGRATING:
  zodToConvex(FlamesOfWarV4.gameSystemConfig.schema.innerType().extend({
    useExperimentalMissions: z.boolean().optional(),
  })),
  zodToConvex(TeamYankeeV2.gameSystemConfig.schema),
);
