import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import {
  Content,
  Item,
  ItemText,
  Portal,
  Root,
  ScrollDownButton,
  ScrollUpButton,
  Trigger,
  Value,
  Viewport,
} from '@radix-ui/react-select';
import { ChevronDown, ChevronUp } from 'lucide-react';

import styles from './TimeSubSelect.module.scss';

export interface TimeSubSelectProps {
  className?: string;
  options: { value: string; label: string; }[]
  onChange?: (value?: number) => void;
  value?: number;
}

type SelectRef = ElementRef<typeof Root>;
type SelectProps = Omit<ComponentPropsWithoutRef<typeof Root>, 'value'> & TimeSubSelectProps;
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
    <Root onValueChange={handleValueChange} disabled={disabled} value={stringValue} {...props}>
      <Trigger className={styles.Trigger}>
        <Value ref={ref} />
      </Trigger>
      <Portal>
        <Content className={styles.Content}>
          <ScrollUpButton className={styles.ScrollButton}>
            <ChevronUp />
          </ScrollUpButton>
          <Viewport className={styles.Viewport}>
            {options.map((item) => (
              <Item className={styles.Item} key={item.value} value={item.value}>
                <ItemText>{item.label}</ItemText>
              </Item>
            ))}
          </Viewport>
          <ScrollDownButton className={styles.ScrollButton}>
            <ChevronDown />
          </ScrollDownButton>
        </Content>
      </Portal>
    </Root>
  );
});
TimeSubSelect.displayName = 'TimeSubSelect';
