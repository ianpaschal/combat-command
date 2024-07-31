import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@radix-ui/react-label';
import clsx from 'clsx';

import { InputSelect, InputSelectProps } from '../InputSelect';

import './FormSelectField.scss';

export interface FormSelectFieldProps extends InputSelectProps {
  label?: string;
  description?: string;
  name: string;
  placeholder?: string;
  className?: string;
}

export const FormSelectField = ({
  name,
  className,
  label,
  description,
  placeholder,
  options,
  ...props
}: FormSelectFieldProps): JSX.Element => {
  const { control, formState: { errors } } = useFormContext();
  const hasErrors = Boolean(errors[name]);
  return (
    <div className={className}>
      {label && (
        <Label className={clsx('FormSelectFieldLabel', { 'FormSelectFieldLabel-error': hasErrors })}>{label}</Label>
      )}
      <Controller
        control={control}
        render={({ field }) => (
          <InputSelect {...field} {...props} options={options} onValueChange={field.onChange} hasError={hasErrors} placeholder={placeholder} />
        )}
        name={name}
      />
      {hasErrors && (
        <div className={clsx('FormSelectFieldErrors')}>{errors[name]?.message as string}</div>
      )}
      {description && (
        <div className={clsx('FormSelectFieldDescription')}>{description}</div>
      )}
    </div>
  );
};