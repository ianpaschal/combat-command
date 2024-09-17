import { cloneElement, ReactElement } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import { Label } from '~/components/generic/Label';

import './FormField.scss';

export interface FormFieldProps {
  description?: string;
  label?: string;
  name: string;
  className?: string;
  children: ReactElement;
}

export const FormField = ({
  className,
  description,
  label,
  name,
  children,
  ...props
}: FormFieldProps): JSX.Element => {
  const { control, formState: { errors } } = useFormContext();
  const hasError = Boolean(errors[name]);
  return (
    <div className={className}>
      {label && (
        <Label className={clsx('FormFieldLabel', { 'FormFieldLabel-error': hasError })}>{label}</Label>
      )}
      <Controller
        control={control}
        render={({ field }) => (
          cloneElement(children, { ...field, ...props, hasError })
        )}
        name={name}
      />
      {hasError && (
        <div className={clsx('FormFieldErrors')}>{errors[name]?.message as string}</div>
      )}
      {description && (
        <div className={clsx('FormFieldDescription')}>{description}</div>
      )}
    </div>
  );
};