import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { GameSystemConfig } from './GameSystemConfigFields.schema';

export type CompatibleFormData = {
  gameSystem: GameSystem;
  gameSystemConfig: GameSystemConfig;
};
