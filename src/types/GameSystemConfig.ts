import { z } from 'zod';

import { fowV4GameSystemConfigSchema } from '~/types/fowV4/fowV4GameSystemConfigSchema';
import { gameSystemSchema } from '~/types/GameSystem';

export const gameSystemConfig = z.object({

  // Rule add-ons
  game_system: gameSystemSchema,
  
  /**
   * The specific configuration options for the selected game system.
   * Saved in a JSONB column.
   */
  config: fowV4GameSystemConfigSchema, // TODO: Replace with a union of other game systems
});

export type GameSystemConfig = z.infer<typeof gameSystemConfig>;
