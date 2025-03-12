import { forwardRef } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';

import { Button } from '~/components/generic/Button';
import { Calendar } from '~/components/generic/Calendar';
import { createLocalDatetimeString } from '~/components/generic/InputDateTime/InputDateTime.utils';
import { TimeSubSelect } from '~/components/generic/InputDateTime/TimeSubSelect';
import { getMinuteOptions, hourOptions } from '~/components/generic/InputDateTime/TimeSubSelect.utils';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';

import styles from './InputDateTime.module.scss';

export interface InputDateTimeProps {
  value?: string,
  onChange?: (date?: string) => void;
}

export const InputDateTime = forwardRef<HTMLInputElement, InputDateTimeProps>(({
  value,
  onChange,
  ...props
}, ref): JSX.Element => {

  // TODO: Add regex to parse value and warn if doesn't match ISO format

  const onDateChange = (selectedDate?: Date) => {
    if (selectedDate && onChange) {
      // onChange(`${format(selectedDate, 'yyyy-MM-dd')}T${hours}:${minutes}:00`);
      const updated = createLocalDatetimeString({ date: format(selectedDate, 'yyyy-MM-dd'), hours, minutes });
      onChange(updated);
    }
  };

  const onHoursChange = (h?: number) => {
    if (h !== undefined && onChange) {
      const updated = createLocalDatetimeString({ date, hours: h, minutes });
      onChange(updated);
    }
  };

  const onMinutesChange = (m?: number) => {
    if (m !== undefined && onChange) {
      // onChange(`${date}T${hours}:${String(m).padStart(2, '0')}:00`);
      const updated = createLocalDatetimeString({ date, hours, minutes: m });
      onChange(updated);
    }
  };

  const input = value || new Date(new Date().setHours(9, 0, 0, 0)).toISOString();

  const [date, time] = input.substring(0, 16).split('T');
  const [hours, minutes] = (time || '00:00').split(':').map((t) => parseInt(t, 10));

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <InputText
          className={styles.Trigger}
          ref={ref}
          slotBefore={<CalendarIcon />}
          value={input ? format(new Date(input), 'PPP, p') : 'Pick a date'} {...props}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.Content} align="start">
          <div className={styles.DateSection}>
            <Calendar
              mode="single"
              selected={new Date(input)}
              onSelect={onDateChange}
              initialFocus
            />
          </div>
          <Separator orientation="horizontal" />
          <div className={styles.TimeSection}>
            <Clock className={styles.ClockIcon} />
            <TimeSubSelect options={hourOptions} onChange={onHoursChange} value={hours} />
            <span>:</span>
            <TimeSubSelect options={getMinuteOptions(15)} onChange={onMinutesChange} value={minutes} />
            <Popover.Close asChild>
              <Button className={styles.CloseButton}>Done</Button>
            </Popover.Close>
          </div>

        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
});
InputDateTime.displayName = 'InputDateTime';
