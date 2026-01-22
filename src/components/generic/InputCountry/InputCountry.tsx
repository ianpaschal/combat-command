import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import {
  CheckIcon,
  ChevronDown,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';
import { Select } from 'radix-ui';

import { FlagCircle } from '~/components/generic/FlagCircle';
import { SelectValue } from '~/components/generic/InputSelect/InputSelect.types';
import { getCountryOptions } from '~/utils/common/getCountryOptions';

import styles from './InputCountry.module.scss';

export interface InputCountryProps {
  'aria-invalid'?: boolean;
  className?: string;
  placeholder?: string;
  onChange?: (value?: SelectValue) => void;
}

type SelectRef = ElementRef<typeof Select.Root>;
type SelectProps = ComponentPropsWithoutRef<typeof Select.Root> & InputCountryProps;
export const InputCountry = forwardRef<SelectRef, SelectProps>(({
  'aria-invalid': ariaInvalid,
  placeholder,
  onChange,
  disabled = false,
  value,
  ...props
}, ref): JSX.Element => {
  const options = getCountryOptions();
  return (
    <Select.Root value={value} onValueChange={onChange} {...props}>
      <Select.Trigger className={clsx(styles.Trigger, { [styles.TriggerHasError]: ariaInvalid, [styles.TriggerDisabled]: disabled })}>
        <Select.Value ref={ref} placeholder={placeholder}>
          {value && (
            <div className={styles.Value}>
              <FlagCircle code={value} />
              {options.find((option) => option.value === value)?.label}
            </div>
          )}
        </Select.Value>
        <Select.Icon className={styles.Icon}>
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.Content}>
          <Select.ScrollUpButton className={styles.ScrollButton}>
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.Viewport}>
            {options.map((option) => (
              <Select.Item className={styles.Item} value={option.value}>
                <FlagCircle code={option.value} />
                <Select.ItemText>{option.label}</Select.ItemText>
                <Select.ItemIndicator className={styles.ItemIndicator}>
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className={styles.ScrollButton}>
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
});
InputCountry.displayName = 'InputCountry';
