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

import './InputSelect.scss';

export interface InputSelectProps<T extends number | string> {
  className?: string;
  options: { value: T, label: string }[];
  hasError?: boolean;
  placeholder?: string;
  onChange?: (value?: T) => void;
  value?: T;
}

type SelectRef = ElementRef<typeof Select.Root>;
type SelectProps<T extends number | string> = Omit<ComponentPropsWithoutRef<typeof Select.Root>, 'value'> & InputSelectProps<T>;
export const InputSelect = forwardRef<SelectRef, SelectProps<number | string>>(({
  options,
  placeholder,
  onChange,
  hasError,
  disabled = false,
  value,
  ...props
}, ref): JSX.Element => {
  const handleChange = (selected: string): void => {
    if (onChange) {
      if (!isNaN(+selected)) {
        onChange(+selected);
      } else {
        onChange(selected);
      }
    }
  };
  const stringValue: string | undefined = value !== undefined && typeof value === 'number' ? value.toString() : value;
  const stringOptions = options.map((item) => ({ value: typeof item.value === 'number' ? item.value.toString() : item.value, label: item.label }));
  const showDisabled = disabled || options.length < 2;
  return (
    <Select.Root onValueChange={handleChange} disabled={showDisabled} value={stringValue} {...props}>
      <Select.Trigger className={clsx('InputSelectTrigger', { 'InputSelectTrigger--hasError': hasError, 'InputSelectTrigger--disabled': showDisabled })}>
        <Select.Value ref={ref} placeholder={placeholder} />
        <Select.Icon className="SelectIcon">
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="SelectContent">
          <Select.ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </Select.ScrollUpButton>
          <Select.Viewport className="SelectViewport">
            {stringOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
});
InputSelect.displayName = 'InputSelect';

type SelectItemRef = ElementRef<typeof Select.Item>;
type SelectItemProps = ComponentPropsWithoutRef<typeof Select.Item>;
const SelectItem = forwardRef<SelectItemRef, SelectItemProps>(({
  children,
  className,
  ...props
}, ref): JSX.Element => (
  <Select.Item className={clsx('SelectItem', className)} {...props} ref={ref}>
    <Select.ItemText>
      {children}
    </Select.ItemText>
    <Select.ItemIndicator className="SelectItemIndicator">
      <CheckIcon />
    </Select.ItemIndicator>
  </Select.Item>
));
SelectItem.displayName = 'SelectItem';
