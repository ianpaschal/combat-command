import {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import clsx from 'clsx';

import './InputText.scss';

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  slotBefore?: ReactNode;
  slotAfter?: ReactNode;
  hasError?: boolean;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(({
  className,
  type,
  hasError = false,
  slotBefore,
  slotAfter,
  disabled,
  ...props
}, ref) => (
  <div className={clsx('InputWrapper', { 'InputWrapper-hasError': hasError, 'InputWrapper-disabled': disabled }, className)}>
    <input
      type={type}
      className={clsx('Input', { 'Input-slotAfter': !!slotAfter, 'Input-slotBefore': !!slotBefore })}
      ref={ref}
      disabled={disabled}
      {...props}
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
));
InputText.displayName = 'InputText';
