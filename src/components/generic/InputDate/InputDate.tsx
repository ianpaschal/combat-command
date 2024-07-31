import {
  forwardRef,
  InputHTMLAttributes,
  useState,
} from 'react';
import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Calendar } from '~/components/generic/Calendar';
import { InputText } from '~/components/generic/InputText';

import './InputDate.scss';

export interface InputDateProps extends InputHTMLAttributes<HTMLInputElement> { }

export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(({
  ...props
}, ref): JSX.Element => {
  const [date, setDate] = useState<Date>();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <InputText
          slotBefore={<CalendarIcon />}
          className="InputDateTrigger"
          value={date ? format(date, 'PPP') : 'Pick a date'}
          ref={ref}
          {...props}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="InputDatePopoverContent" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});