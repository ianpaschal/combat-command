import {
  cloneElement,
  isValidElement,
  ReactElement,
  useContext,
} from 'react';
import {
  Controller,
  get,
  useFormContext,
} from 'react-hook-form';
import clsx from 'clsx';

import { FormStatusContext } from '~/components/generic/Form/Form.context';
import { Label } from '~/components/generic/Label';
import { getComponentName } from '~/utils/componentLib/getComponentName';

import styles from './FormField.module.scss';

export interface FormFieldProps {
  children: ReactElement;
  className?: string;
  description?: string;
  disabled?: boolean;
  inputWidth?: string;
  label: string;
  loading?: boolean;
  name?: string;
  orientation?: 'vertical' | 'horizontal';
}

export const FormField = ({
  children,
  className,
  description,
  disabled = false,
  inputWidth,
  label,
  loading,
  name,
  orientation,
  ...props
}: FormFieldProps): JSX.Element => {
  const { control, formState: { errors } } = useFormContext();
  const { disabled: formDisabled } = useContext(FormStatusContext);
  const error = get(errors, name);
  const showErrorState = !!error;
  const nonTextual = isValidElement(children) && ['Switch', 'Checkbox'].includes(getComponentName(children));
  const isHorizontal = orientation ? orientation === 'horizontal' : nonTextual;
  return (
    <div
      className={clsx(styles.Root, {
        [styles['Root-vertical']]: !isHorizontal,
        [styles['Root-horizontal']]: isHorizontal,
      }, className)}
      style={inputWidth ? { '--input-width': inputWidth } as React.CSSProperties : undefined}
    >
      <Label className={styles.Label} htmlFor={name}>{label}</Label>
      {(name && control) ? (
        <>
          <Controller
            control={control}
            render={({ field }) => (
              cloneElement(children, {
                ...field,
                ...props,
                id: name,
                ...(nonTextual ? {
                  onCheckedChange: field.onChange,
                  checked: !!field.value,
                } : {}),
                className: styles.Input,
                'aria-invalid': showErrorState,
                'aria-label': name,
                disabled: formDisabled || disabled,
                loading,
              })
            )}
            name={name}
          />
          {showErrorState && (
            <div className={styles.Errors}>{error?.message as string}</div>
          )}
        </>
      ) : (
        cloneElement(children, {
          ...props,
          className: clsx(styles.Input),
          disabled: formDisabled || disabled,
          loading,
        })
      )}
      {description && (
        <div className={styles.Description}>{description}</div>
      )}
    </div>
  );
};
