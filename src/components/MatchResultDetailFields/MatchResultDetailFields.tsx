import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { GameSystem, getGameSystem } from '@ianpaschal/combat-command-game-systems/common';

import { FlamesOfWarV4MatchResultDetailFields } from './gameSystems/FlamesOfWarV4MatchResultDetailFields';
import { TeamYankeeV2MatchResultDetailFields } from './gameSystems/TeamYankeeV2MatchResultDetailFields';
import { usePlayerOptions } from './MatchResultDetailFields.hooks';
import { CompatibleFormData } from './MatchResultDetailFields.types';

export interface MatchResultDetailFieldsProps {
  className?: string;
}

export const MatchResultDetailFields = ({
  className,
}: MatchResultDetailFieldsProps): JSX.Element => {
  const { reset, watch, getFieldState } = useFormContext<CompatibleFormData>();
  const gameSystem = watch('gameSystem');

  // If the game system changes, reset to the matching default values (but only if form is dirty):
  useEffect(() => {
    if (getFieldState('gameSystem').isTouched) {
      const { gameSystemConfig, matchResultDetails } = getGameSystem(gameSystem);
      reset((prev) => ({
        ...prev,
        gameSystemConfig: gameSystemConfig.defaultValues,
        details: matchResultDetails.defaultValues,
      }));
    }
  }, [gameSystem, reset, getFieldState]);

  /*
   * Player options could also be created at the game system level, but doing so would introduce a
   * dependency on the back-end/API within the game system-specific field components, making them
   * less agnostic.
   */
  const playerOptions = usePlayerOptions();

  const sharedProps = {
    className,
    playerOptions,
  };

  if (gameSystem === GameSystem.FlamesOfWarV4) {
    return (
      <FlamesOfWarV4MatchResultDetailFields {...sharedProps} />
    );
  }

  if (gameSystem === GameSystem.TeamYankeeV2) {
    return (
      <TeamYankeeV2MatchResultDetailFields {...sharedProps} />
    );
  }

  throw new Error(`Could not find <MatchResultDetailFields/> for game system ${gameSystem}`);
};
