import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

export const useAsyncState = <T>(
  defaultValue: T,
  asyncValue?: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(asyncValue ?? defaultValue);
  useEffect(() => {
    if (asyncValue && asyncValue !== value) {
      setValue(asyncValue);
    }
  }, [value, asyncValue]);
  return [
    value,
    setValue,
  ];
};
