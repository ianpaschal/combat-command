import { useEffect } from 'react';
import {
  FieldPath,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import { SelectOption } from '@ianpaschal/combat-command-game-systems/common';

export const useAutoFillSelect = <TFieldValues extends FieldValues>(
  options: SelectOption<string>[],
  path: FieldPath<TFieldValues>,
): void => {
  const { watch, setValue } = useFormContext<TFieldValues>();
  const value = watch(path);

  useEffect(() => {
    const isCurrentValueAvailable = options.some((option) => option.value === value);

    if (!isCurrentValueAvailable && options.length > 0) {
      const lastOption = options[options.length - 1];
      setValue(path, lastOption.value as TFieldValues[typeof path]);
    }
  }, [options, value, setValue, path]);
};
