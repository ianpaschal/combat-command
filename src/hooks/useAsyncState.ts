import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import isEqual from 'fast-deep-equal/es6';

export const useAsyncState = <T>(
  defaultValue: T,
  asyncValue?: T,
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(asyncValue ?? defaultValue);
  useEffect(() => {
    if (asyncValue && !isEqual(asyncValue, value)) {
      setValue(asyncValue);
    }
  }, [value, asyncValue]);
  return [
    value,
    setValue,
  ];
};
