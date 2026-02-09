import {
  FieldPathByValue,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import { SelectOption, SelectValue } from '@ianpaschal/combat-command-components';
import {
  getTournamentPairingConfigByMethod,
  getTournamentPairingMethodByConfig,
  getTournamentPairingMethodOptions,
  TournamentPairingConfig,
  TournamentPairingMethod,
} from '@ianpaschal/combat-command-game-systems/common';

export type UsePresetFieldResult = {
  value: TournamentPairingMethod | null;
  onChange: (value: SelectValue | null) => void;
  options: SelectOption[];
};

export const usePresetField = <TFormValues extends FieldValues>(
  path?: FieldPathByValue<TFormValues, TournamentPairingConfig>,
): UsePresetFieldResult => {
  const { watch, setValue, reset } = useFormContext<TFormValues>();
  const currentConfig = (path ? watch(path) : watch()) as unknown as TournamentPairingConfig;
  return {
    value: getTournamentPairingMethodByConfig(currentConfig),
    onChange: (value: string | number | null) => {
      if (!value || typeof value !== 'string') {
        return;
      }
      const config = getTournamentPairingConfigByMethod(value);
      if (!config) {
        return;
      }
      if (path) {
        setValue(path as Parameters<typeof setValue>[0], config as Parameters<typeof setValue>[1]);
      } else {
        reset(config as unknown as TFormValues);
      }
    },
    options: getTournamentPairingMethodOptions(),
  };
};
