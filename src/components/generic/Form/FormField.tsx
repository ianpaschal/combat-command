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
}

const cn = createCn('FormField');

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
  if (isValidElement(children) && ['Switch', 'Checkbox'].includes(getComponentName(children))) {
    console.log('Use horizontal layout');
  }
  return (
    <div className={className}>
      {label && (
        <Label className={clsx(cn('_Label'), { [cn('_Label-error')]: hasError })}>{label}</Label>
      )}
      <Controller
        control={control}
        render={({ field }) => (
          cloneElement(children, { ...field, ...props, hasError })
        )}
        name={name}
      />
      {hasError && (
        <div className={clsx(cn('_Errors'))}>{errors[name]?.message as string}</div>
      )}
      {description && (
        <div className={clsx(cn('_Description'))}>{description}</div>
      )}
    </div>
  );
};