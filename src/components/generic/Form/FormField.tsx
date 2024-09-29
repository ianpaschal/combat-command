import {
  cloneElement,
  isValidElement,
  ReactElement,
} from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import clsx from 'clsx';

import { Label } from '~/components/generic/Label';
import { createCn } from '~/utils/componentLib/createCn';
import { getComponentName } from '~/utils/componentLib/getComponentName';

import './FormField.scss';

export interface FormFieldProps {
  description?: string;
  label?: string;
  name: string;
  className?: string;
  children: ReactElement;
  disabled?: boolean;
}

const cn = createCn('FormField');

export const FormField = ({
  className,
  description,
  label,
  name,
  disabled = false,
  children,
  ...props
}: FormFieldProps): JSX.Element => {
  const { control, formState: { errors } } = useFormContext();
  const hasError = Boolean(errors[name]);
  if (isValidElement(children) && ['Switch', 'Checkbox'].includes(getComponentName(children))) {
    console.log('Use horizontal layout');
  }
  return (
    <div className={clsx(cn(), className)}>
      {label && (
        <Label className={clsx(cn('_Label'), { [cn('_Label-error')]: hasError, [cn('_Label-disabled')]: disabled })}>{label}</Label>
      )}
      <Controller
        control={control}
        render={({ field }) => (
          cloneElement(children, { ...field, ...props, hasError, disabled })
        )}
        name={name}
      />
      {hasError && (
        <div className={clsx(cn('_Errors'))}>{errors[name]?.message as string}</div>
      )}
      {description && (
        <div className={clsx(cn('_Description'), { [cn('_Description-error')]: hasError, [cn('_Description-disabled')]: disabled })}>{description}</div>
      )}
    </div>
  );
};