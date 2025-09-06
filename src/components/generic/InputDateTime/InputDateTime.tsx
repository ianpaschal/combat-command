import { forwardRef } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Popover } from 'radix-ui';

import { Button } from '~/components/generic/Button';
import { Calendar } from '~/components/generic/Calendar';
import { TimeSubSelect } from '~/components/generic/InputDateTime/TimeSubSelect';
import { getMinuteOptions, hourOptions } from '~/components/generic/InputDateTime/TimeSubSelect.utils';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';

import styles from './InputDateTime.module.scss';

export interface InputDateTimeProps {
  value?: Date;
  onChange?: (date?: Date) => void;
}

export const InputDateTime = forwardRef<HTMLInputElement, InputDateTimeProps>(({
  value,
  onChange,
  ...props
}, ref): JSX.Element => {
  const currentDate = (() => {
    const date = new Date();
    date.setMinutes(0, 0, 0);
    return value ?? date;
  })();

  // Handle date selection:
  const onDateChange = (selectedDate: Date | undefined): void => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(currentDate.getHours(), currentDate.getMinutes());
      onChange?.(newDate);
    }
  };

  // Handle hours:
  const onHoursChange = (hours?: number): void => {
    if (hours !== undefined) {
      const newDate = new Date(currentDate);
      newDate.setHours(hours);
      onChange?.(newDate);
    }
  };

  // Handle minutes:
  const onMinutesChange = (minutes?: number): void => {
    if (minutes !== undefined) {
      const newDate = new Date(currentDate);
      newDate.setMinutes(minutes);
      onChange?.(newDate);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <InputText
          className={styles.Trigger}
          ref={ref}
          slotBefore={<CalendarIcon />}
          value={currentDate ? format(currentDate, 'PPP, HH:mm') : 'Pick a date'} {...props}
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className={styles.Content} align="start">
          <div className={styles.DateSection}>
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={onDateChange}
              initialFocus
            />
          </div>
          <Separator orientation="horizontal" />
          <div className={styles.TimeSection}>
            <Clock className={styles.ClockIcon} />
            <TimeSubSelect options={hourOptions} onChange={onHoursChange} value={currentDate.getHours()} />
            <span>:</span>
            <TimeSubSelect options={getMinuteOptions(15)} onChange={onMinutesChange} value={currentDate.getMinutes()} />
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
