import { FormEvent, forwardRef } from 'react';
import clsx from 'clsx';

import { Checkbox } from '~/components/generic/Checkbox';
import { Label } from '~/components/generic/Label';
import { ElementSize, ElementVariant } from '~/types/componentLib';

import styles from './InputMultiCheckbox.module.scss';

export interface InputMultiCheckboxProps {
  className?: string;
  disabled?: boolean;
  onChange: (value: string[]) => void;
  options: {
    label: string;
    value: string;
  }[];
  size?: ElementSize;
  value: string[];
  variant?: ElementVariant;
}

export const InputMultiCheckbox = forwardRef<HTMLDivElement, InputMultiCheckboxProps>(({
  className,
  disabled = false,
  onChange,
  options,
  value,
  ...checkboxProps
}, ref) => {
  const checked = new Set(value ?? []);
  const handleChange = (key: string, isChecked: boolean | FormEvent<HTMLButtonElement>): void => {
    if (isChecked) {
      checked.add(key);
    } else {
      checked.delete(key);
    }
    onChange(Array.from(checked));
  };
  return (
    <div ref={ref} className={clsx(styles.InputMultiCheckbox, className)}>
      {options.map((option) => (
        <div key={option.value} className={styles.InputMultiCheckbox_Row}>
          <Checkbox
            checked={checked.has(option.value)}
            disabled={disabled}
            onChange={(checked) => handleChange(option.value, checked)}
            {...checkboxProps}
          />
          <Label>
            {option.label}
          </Label>
        </div>
      ))}
    </div>
  );
});
InputMultiCheckbox.displayName = 'InputMultiCheckbox';
