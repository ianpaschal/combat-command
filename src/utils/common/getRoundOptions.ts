import { InputSelectOption } from '~/components/generic/InputSelect';

export const getRoundOptions = (limit: number = 0): InputSelectOption<number>[] => (
  Array.from({ length: limit + 1 }, (_, i) => i).map((round) => ({
    label: `Round ${round + 1}`,
    value: round,
  }))
);
