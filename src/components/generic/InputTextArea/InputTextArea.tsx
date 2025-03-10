import { forwardRef, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

import './InputTextArea.scss';

export interface InputTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const InputTextArea = forwardRef<HTMLTextAreaElement, InputTextAreaProps>(({
  className,
  hasError = false,
  ...props
}, ref) => (
  <textarea
    className={clsx('InputTextArea', { 'InputWrapper-hasError': hasError }, className)}
    ref={ref}
    {...props}
  />
));
