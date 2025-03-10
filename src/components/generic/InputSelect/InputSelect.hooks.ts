import { InputSelectItem, SelectValue } from '~/components/generic/InputSelect/InputSelect.types';

/**
 * Converts a SelectValue into a string so that it can be used as a Radix <Select/> value.
 * @param value 
 * @returns 
 */
const stringify = (value: SelectValue): string => {
  if (value === null) {
    return 'NULL';
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  return value;
};

/**
 * Converts a string into a SelectValue so that a Radix <Select/> can return more types.
 * @param value 
 * @returns 
 */
const deStringify = (value: string): SelectValue => {
  if (value === 'NULL') {
    return null;
  } else if (value.match(/^-?\d+$/)) {
    return parseInt(value, 10);
  } 
  return value;
};

type UseStringSelectResult = [string | undefined, InputSelectItem<string>[], (value: string) => void];

// FIXME: Open GitHub issue on Radix to solve this issue.
/**
 *
 * @param value 
 * @param options 
 * @param onChange 
 * @returns 
 */
export const useStringSelect = (
  value: SelectValue | undefined,
  options: InputSelectItem<SelectValue>[],
  onChange?: (value: SelectValue | undefined) => void,
): UseStringSelectResult => {
  const stringValue = value !== undefined ? stringify(value) : value;
  const stringOptions = options.map((item) => {
    if (item === '-') {
      return item;
    }
    if ('options' in item) {
      return ({
        label: item.label,
        options: item.options.map(({ label, value }) => ({ label, value: stringify(value) })),
      });
    }
    return ({
      label: item.label,
      value: stringify(item.value),
    });
  });
  const handleValueChange = (value?: string): void => {
    if (onChange) {
      onChange(value ? deStringify(value) : undefined);
    }
  };
  return [
    stringValue,
    stringOptions,
    handleValueChange,
  ];
};
