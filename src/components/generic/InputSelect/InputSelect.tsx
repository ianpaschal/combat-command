import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import {
  Content,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Trigger,
  Value,
  Viewport,
} from '@radix-ui/react-select';
import clsx from 'clsx';
import {
  CheckIcon,
  ChevronDown,
  ChevronDownIcon,
  ChevronUpIcon,
} from 'lucide-react';

import './InputSelect.scss';

export interface InputSelectProps<T extends number | string> {
  className?: string;
  options: { value: T, label: string }[];
  hasError?: boolean;
  placeholder?: string;
  onChange?: (value?: T) => void;
  value?: T;
}

type SelectRef = ElementRef<typeof Root>;
type SelectProps<T extends number | string> = Omit<ComponentPropsWithoutRef<typeof Root>, 'value'> & InputSelectProps<T>;
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
  return (
    <Root onValueChange={handleChange} disabled={disabled} value={stringValue} {...props}>
      <Trigger className={clsx('InputSelectTrigger', { 'InputSelectTrigger--hasError': hasError, 'InputSelectTrigger--disabled': disabled })}>
        <Value ref={ref} placeholder={placeholder} />
        <Icon className="SelectIcon">
          <ChevronDown />
        </Icon>
      </Trigger>
      <Portal>
        <Content className="SelectContent">
          <ScrollUpButton className="SelectScrollButton">
            <ChevronUpIcon />
          </ScrollUpButton>
          <Viewport className="SelectViewport">
            {stringOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
            ))}
          </Viewport>
          <ScrollDownButton className="SelectScrollButton">
            <ChevronDownIcon />
          </ScrollDownButton>
        </Content>
      </Portal>
    </Root>
  );
});
InputSelect.displayName = 'InputSelect';

type SelectItemRef = ElementRef<typeof Item>;
type SelectItemProps = ComponentPropsWithoutRef<typeof Item>;
const SelectItem = forwardRef<SelectItemRef, SelectItemProps>(({
  children,
  className,
  ...props
}, ref): JSX.Element => (
  <Item className={clsx('SelectItem', className)} {...props} ref={ref}>
    <ItemText>{children}</ItemText>
    <ItemIndicator className="SelectItemIndicator">
      <CheckIcon />
    </ItemIndicator>
  </Item>
));
SelectItem.displayName = 'SelectItem';
