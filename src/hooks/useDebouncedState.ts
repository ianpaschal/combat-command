import { useState } from 'react';
import debounce from 'debounce';

type UseDebouncedStateResult<T> = [
  {
    value: T;
    debouncedValue: T;
    debouncing: boolean;
  },
  (value: T) => void,
];

export const useDebouncedState = <T>(
  initialState: T,
  debounceTime = 250,
): UseDebouncedStateResult<T> => {
  const [value, setValue] = useState<T>(initialState);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialState);
  const [debouncing, setDebouncing] = useState<boolean>(false);

  const debouncedSetSearch = debounce((v: T): void => {
    setDebouncedValue(v);
    setDebouncing(false);
  }, debounceTime);

  const update = (v: T): void => {
    setValue(v);
    debouncedSetSearch(v);
    setDebouncing(true);
  };

  return [
    {
      value,
      debouncedValue,
      debouncing,
    },
    update,
  ];
};
