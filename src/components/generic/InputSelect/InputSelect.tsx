import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import {
  Content,
  Group,
  Icon,
  Item,
  ItemIndicator,
  ItemText,
  Label,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Separator,
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

export interface InputSelectOption {
  value: string;
  label: string;
}
export interface InputSelectGroup {
  label: string;
  options: InputSelectOption[];
}

export type InputSelectItem = (InputSelectGroup | InputSelectOption | '-');

export interface InputSelectProps {
  className?: string;
  options: InputSelectItem[];
  hasError?: boolean;
  placeholder?: string;
  onChange?: (value: string) => void;
}

type SelectRef = ElementRef<typeof Root>;
type SelectProps = ComponentPropsWithoutRef<typeof Root> & InputSelectProps;
export const InputSelect = forwardRef<SelectRef, SelectProps>(({
  options,
  placeholder,
  onChange,
  disabled = false,
  ...props
}, ref): JSX.Element => (
  <Root onValueChange={onChange} disabled={disabled} {...props}>
    <Trigger className={clsx('InputSelectTrigger', { 'InputSelectTrigger--disabled': disabled })}>
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
          {options.map((item, i) => {
            if (typeof item === 'string' && item === '-') {
              return (
                <Separator key={`${i}_separator`} className="SelectSeparator" />
              );
            } else if ('options' in item) {
              return (
                <Group key={item.label} className="SelectGroup">
                  <Label className="SelectGroupLabel">{item.label}</Label>
                  {item.options.map((subItem) => (
                    <SelectItem key={subItem.value} value={subItem.value}>
                      {subItem.label}
                    </SelectItem>
                  ))}
                </Group>
              );
            } else {
              return (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              );
            }
          })}
        </Viewport>
        <ScrollDownButton className="SelectScrollButton">
          <ChevronDownIcon />
        </ScrollDownButton>
      </Content>
    </Portal>
  </Root>
));
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