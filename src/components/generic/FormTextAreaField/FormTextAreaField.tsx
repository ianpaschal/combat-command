import { Controller, useFormContext } from 'react-hook-form';
import { Label } from '@radix-ui/react-label';
import clsx from 'clsx';

import { InputTextArea, InputTextAreaProps } from '~/components/generic/InputTextArea';

import './FormTextAreaField.scss';

export interface FormTextAreaFieldProps extends InputTextAreaProps {
  label?: string;
  description?: string;
  name: string;
}

export const FormTextAreaField = ({
  name,
  label,
  description,
  className,
  ...props
}: FormTextAreaFieldProps): JSX.Element => {
  const { control, formState: { errors } } = useFormContext();
  const hasErrors = Boolean(errors[name]);
  return (
    <div className={className}>
      {label && (
        <Label className={clsx('FormTextAreaFieldLabel', { 'FormTextAreaFieldLabel-error': hasErrors })}>{label}</Label>
      )}
      <Controller
        control={control}
        render={({ field }) => (
          <InputTextArea {...field} {...props} hasError={hasErrors} />
        )}
        name={name}
      />
      {hasErrors && (
        <div className={clsx('FormTextAreaFieldErrors')}>{errors[name]?.message as string}</div>
      )}
      {description && (
        <div className={clsx('FormTextAreaFieldDescription')}>{description}</div>
      )}
    </div>
  );
};