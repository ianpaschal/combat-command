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

import { FlagCircle } from '~/components/generic/FlagCircle';
import { SelectValue } from '~/components/generic/InputSelect/InputSelect.types';
import { getCountryOptions } from '~/utils/common/getCountryOptions';

import styles from './InputCountry.module.scss';

export interface InputCountryProps {
  className?: string;
  hasError?: boolean;
  placeholder?: string;
  onChange?: (value?: SelectValue) => void;
}

type SelectRef = ElementRef<typeof Root>;
type SelectProps = ComponentPropsWithoutRef<typeof Root> & InputCountryProps;
export const InputCountry = forwardRef<SelectRef, SelectProps>(({
  placeholder,
  onChange,
  hasError,
  disabled = false,
  value,
  ...props
}, ref): JSX.Element => {
  const options = getCountryOptions();
  return (
    <Root value={value} onValueChange={onChange} {...props}>
      <Trigger className={clsx(styles.Trigger, { [styles.TriggerHasError]: hasError, [styles.TriggerDisabled]: disabled })}>
        <Value ref={ref} placeholder={placeholder}>
          {value && (
            <div className={styles.Value}>
              <FlagCircle code={value} />
              {options.find((option) => option.value === value)?.label}
            </div>
          )}
        </Value>
        <Icon className={styles.Icon}>
          <ChevronDown />
        </Icon>
      </Trigger>
      <Portal>
        <Content className={styles.Content}>
          <ScrollUpButton className={styles.ScrollButton}>
            <ChevronUpIcon />
          </ScrollUpButton>
          <Viewport className={styles.Viewport}>
            {options.map((option) => (
              <Item className={styles.Item} value={option.value}>
                <FlagCircle code={option.value} />
                <ItemText>{option.label}</ItemText>
                <ItemIndicator className={styles.ItemIndicator}>
                  <CheckIcon />
                </ItemIndicator>
              </Item>
            ))}
          </Viewport>
          <ScrollDownButton className={styles.ScrollButton}>
            <ChevronDownIcon />
          </ScrollDownButton>
        </Content>
      </Portal>
    </Root>
  );
});
InputCountry.displayName = 'InputCountry';
