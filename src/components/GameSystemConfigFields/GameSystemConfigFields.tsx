import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { FlamesOfWarV4GameSystemConfigFields } from './gameSystems/FlamesOfWarV4GameSystemConfigFields';
import { TeamYankeeV2GameSystemConfigFields } from './gameSystems/TeamYankeeV2GameSystemConfigFields';
import { CompatibleFormData } from './GameSystemConfigFields.types';
import { getGameSystemConfigDefaultValues } from './GameSystemConfigFields.utils';

export interface GameSystemConfigFieldsProps {
  className?: string;
}

export const GameSystemConfigFields = ({
  className,
}: GameSystemConfigFieldsProps): JSX.Element => {
  const { reset, watch } = useFormContext<CompatibleFormData>();
  const gameSystem = watch('gameSystem');

  // If the game system changes, reset to the matching default values:
  useEffect(() => {
    reset((prev) => ({
      ...prev,
      gameSystemConfig: getGameSystemConfigDefaultValues(gameSystem),
    }));
  }, [gameSystem, reset]);

  if (gameSystem === GameSystem.FlamesOfWarV4) {
    return (
      <FlamesOfWarV4GameSystemConfigFields className={className} />
    );
  }

  if (gameSystem === GameSystem.TeamYankeeV2) {
    return (
      <TeamYankeeV2GameSystemConfigFields className={className} />
    );
  }

  throw new Error(`Could not find <GameSystemConfigFields/> for game system ${gameSystem}`);
};
