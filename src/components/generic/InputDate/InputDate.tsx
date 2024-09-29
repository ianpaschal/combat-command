import {
  forwardRef,
  InputHTMLAttributes,
  useState,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { Calendar } from '~/components/generic/Calendar';
import { InputText } from '~/components/generic/InputText';

import './InputDate.scss';

export interface InputDateProps {
  value?: string,
  onChange?: (date?: string) => void;
}

export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(({
  value,
  onChange,
  ...props
}, ref): JSX.Element => (
  <Popover.Root>
    <Popover.Trigger asChild>
      <InputText
        className="InputDateTrigger"
        ref={ref}
        slotBefore={<CalendarIcon />}
        value={value ? format(new Date(value), 'PPP') : 'Pick a date'} {...props}
      />
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content className="InputDatePopoverContent" align="start">
        <Calendar
          mode="single"
          selected={new Date(value || '')}
          onSelect={(date?: Date) => onChange && onChange(date ? date.toISOString() : undefined)}
          initialFocus
        />
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
));
InputDate.displayName = 'InputDate';