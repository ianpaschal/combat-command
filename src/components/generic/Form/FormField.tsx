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

import styles from './FormField.module.scss';

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
  const nonTextual = isValidElement(children) && ['Switch', 'Checkbox'].includes(getComponentName(children));

  return (
    <div
      className={clsx(styles.Root, {
        [styles['Root-vertical']]: !nonTextual,
        [styles['Root-horizontal']]: nonTextual,
      }, className)}
    >
      <Label className={clsx(styles.Label)} htmlFor={name}>{label}</Label>
      {(name && control) ? (
        <>
          <Controller
            control={control}
            render={({ field }) => (
              cloneElement(children, { ...field, ...props, className: clsx(styles.Input), hasError, disabled })
            )}
            name={name}
          />
          {hasError && (
            <div className={clsx(cn('Errors'))}>{errors[name]?.message as string}</div>
          )}
        </>
      ) : (
        cloneElement(children, { ...props, className: clsx(styles.Input), disabled })
      )}
      {description && (
        <div className={clsx(styles.Description)}>{description}</div>
      )}
    </div>
  );
};