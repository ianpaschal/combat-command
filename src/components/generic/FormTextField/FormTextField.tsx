import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@radix-ui/react-label';
import clsx from 'clsx';

import { InputText, InputTextProps } from '../InputText';

import './FormTextField.scss';

export interface FormTextFieldProps extends InputTextProps {
  label?: string;
  description?: string;
  name: string;
}

export const FormTextField = ({
  name,
  label,
  description,
  className,
  ...props
}: FormTextFieldProps): JSX.Element => {
  const { control, formState: { errors } } = useFormContext();
  const hasErrors = Boolean(errors[name]);
  return (
    <div className={className}>
      {label && (
        <Label className={clsx('FormTextFieldLabel', { 'FormTextFieldLabel-error': hasErrors })}>{label}</Label>
      )}
      <Controller
        control={control}
        render={({ field }) => (
          <InputText {...field} {...props} hasError={hasErrors} />
        )}
        name={name}
      />
      {hasErrors && (
        <div className={clsx('FormTextFieldErrors')}>{errors[name]?.message as string}</div>
      )}
      {description && (
        <div className={clsx('FormTextFieldDescription')}>{description}</div>
      )}
    </div>
  );
};