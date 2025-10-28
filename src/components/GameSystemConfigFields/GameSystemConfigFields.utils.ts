import { GameSystem, getGameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { GameSystemConfig } from './GameSystemConfigFields.schema';

export const validateGameSystemConfig = (
  data: {
    gameSystem: GameSystem;
    gameSystemConfig: GameSystemConfig;
  },
): boolean => {
  const { gameSystemConfig } = getGameSystem(data.gameSystem);
  return gameSystemConfig.schema.safeParse(data.gameSystemConfig).success;
};

export const getGameSystemConfigDefaultValues = (
  gameSystem: GameSystem,
): GameSystemConfig => {
  const { gameSystemConfig } = getGameSystem(gameSystem);
  return gameSystemConfig.defaultValues;
};
