import { forwardRef, TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

import './InputTextArea.scss';

export type InputTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const InputTextArea = forwardRef<HTMLTextAreaElement, InputTextAreaProps>(({
  className,
  ...props
}, ref) => (
  <textarea
    className={clsx('InputTextArea', className)}
    ref={ref}
    {...props}
  />
));
