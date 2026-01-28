import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { FlamesOfWarV4GameSystemConfigFields } from './gameSystems/FlamesOfWarV4GameSystemConfigFields';
import { TeamYankeeV2GameSystemConfigFields } from './gameSystems/TeamYankeeV2GameSystemConfigFields';

export interface GameSystemConfigFieldsProps {
  className?: string;
}

export const GameSystemConfigFields = ({
  className,
}: GameSystemConfigFieldsProps): JSX.Element => {
  const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState<boolean>(false);
  const { watch } = useFormContext();
  const gameSystem = watch('gameSystem');

  const formProps = {
    advancedOptionsVisible,
    setAdvancedOptionsVisible,
    className,
  };

  if (gameSystem === GameSystem.FlamesOfWarV4) {
    return (
      <FlamesOfWarV4GameSystemConfigFields {...formProps} />
    );
  }

  if (gameSystem === GameSystem.TeamYankeeV2) {
    return (
      <TeamYankeeV2GameSystemConfigFields {...formProps} />
    );
  }

  throw new Error(`Could not find <GameSystemConfigFields/> for game system ${gameSystem}`);
};
