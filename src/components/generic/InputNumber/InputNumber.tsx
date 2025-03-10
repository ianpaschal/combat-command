import {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import clsx from 'clsx';

import { safelyConvertStringToNumber, safetyConvertNumberToString } from '~/components/generic/InputNumber/InputNumber.utils';

import './InputNumber.scss';

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  slotBefore?: ReactNode;
  slotAfter?: ReactNode;
  hasError?: boolean;
  value?: number;
  onChange?: (value?: number) => void;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(({
  className,
  hasError = false,
  slotBefore,
  slotAfter,
  value,
  onChange,
  ...props
}, ref) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(safelyConvertStringToNumber(e.target.value));
    }
  };
  return (
    <div className={clsx('InputWrapper', { 'InputWrapper-hasError': hasError }, className)}>
      <input
        className={clsx('Input', { 'Input-slotAfter': !!slotAfter, 'Input-slotBefore': !!slotBefore })}
        ref={ref}
        {...props}
        type="number"
        value={safetyConvertNumberToString(value)}
        onChange={handleChange}
      />
      {slotBefore && (
        <div className={clsx('InputSlotBefore')}>
          {slotBefore}
        </div>
      )}
      {slotAfter && (
        <div className={clsx('InputSlotAfter')}>
          {slotAfter}
        </div>
      )}
    </div>
  );
});
InputNumber.displayName = 'InputNumber';
