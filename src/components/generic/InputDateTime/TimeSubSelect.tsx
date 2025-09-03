import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Select } from 'radix-ui';

import styles from './TimeSubSelect.module.scss';

export interface TimeSubSelectProps {
  className?: string;
  options: { value: string; label: string; }[]
  onChange?: (value?: number) => void;
  value?: number;
}

type SelectRef = ElementRef<typeof Select.Root>;
type SelectProps = Omit<ComponentPropsWithoutRef<typeof Select.Root>, 'value'> & TimeSubSelectProps;
export const TimeSubSelect = forwardRef<SelectRef, SelectProps>(({
  onChange,
  options,
  disabled = false,
  value,
  ...props
}, ref): JSX.Element => {
  const handleValueChange = (v: string): void => {
    if (onChange) {
      onChange(parseInt(v, 10));
    }
  };
  const stringValue = value?.toString();
  return (
    <Select.Root onValueChange={handleValueChange} disabled={disabled} value={stringValue} {...props}>
      <Select.Trigger className={styles.Trigger}>
        <Select.Value ref={ref} />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className={styles.Content}>
          <Select.ScrollUpButton className={styles.ScrollButton}>
            <ChevronUp />
          </Select.ScrollUpButton>
          <Select.Viewport className={styles.Viewport}>
            {options.map((item) => (
              <Select.Item className={styles.Item} key={item.value} value={item.value}>
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className={styles.ScrollButton}>
            <ChevronDown />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
});
TimeSubSelect.displayName = 'TimeSubSelect';
