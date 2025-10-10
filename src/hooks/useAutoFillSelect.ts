import { useEffect } from 'react';
import { SelectOption } from '@ianpaschal/combat-command-game-systems/common';

export const useAutoFillSelect = <T extends string>(
  options: SelectOption<T>[], // TODO: Why no MissionMatrix?
  value: T | undefined, // TODO: Why no MissionMatrix?
  onAutoSet: (value: T) => void,
): void => {
  useEffect(() => {
    if (options.length === 1 && !!value && value !== options[0].value) {
      onAutoSet(options[0].value);
    }
  }, [
    options,
    value,
    onAutoSet,
  ]);
};
