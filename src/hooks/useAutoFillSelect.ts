import { useEffect } from 'react';
import { SelectOption } from '@ianpaschal/combat-command-game-systems/common';

export const useAutoFillSelect = <T extends string>(
  options: SelectOption<T>[],
  value: T | undefined,
  onAutoSet: (value: T) => void,
): void => {
  useEffect(() => {
    const isCurrentValueAvailable = options.some((option) => option.value === value);

    if (!isCurrentValueAvailable && options.length > 0) {
      const lastOption = options[options.length - 1];
      onAutoSet(lastOption.value);
    }
  }, [options, value, onAutoSet]);
};
