import {
  cloneElement,
  isValidElement,
  ReactElement,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import { Label } from '~/components/generic/Label';
import { bem } from '~/utils/componentLib/bem';
import { getComponentName } from '~/utils/componentLib/getComponentName';

import './FormField.scss';

export interface FormFieldProps {
  children: ReactElement;
  className?: string;
  description?: string;
  disabled?: boolean;
  label: string;
  name?: string;
}

const cn = bem('FormField');

export const FormField = ({
  children,
  className,
  description,
  disabled = false,
  label,
  name,
  ...props
}: FormFieldProps): JSX.Element => {
  const { control, formState: { errors } } = useFormContext();
  const hasError = !!name && !!errors[name];
  const horizontal = isValidElement(children) && ['Switch', 'Checkbox'].includes(getComponentName(children));

  return (
    <div className={clsx(cn(), { [`${cn()}-horizontal`]: horizontal }, className)}>
      <Label className={cn('Label', { hasError, disabled, horizontal })} htmlFor={name}>{label}</Label>
      {(name && control) ? (
        <>
          <Controller
            control={control}
            render={({ field }) => (
              cloneElement(children, { ...field, ...props, className: cn('Input', { hasError, disabled, horizontal }), hasError, disabled })
            )}
            name={name}
          />
          {hasError && (
            <div className={clsx(cn('Errors'))}>{errors[name]?.message as string}</div>
          )}
        </>
      ) : (
        cloneElement(children, { ...props, className: cn('Input', { disabled, horizontal }), disabled })
      )}
      {description && (
        <div className={cn('Description', { hasError, disabled, horizontal })}>{description}</div>
      )}
    </div>
  );
};