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
  label: string;
  name?: string;
}

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
  const { disabled: formDisabled } = useContext(FormStatusContext);
  const error = get(errors, name);
  const showErrorState = !!error;
  const nonTextual = isValidElement(children) && ['Switch', 'Checkbox'].includes(getComponentName(children));
  return (
    <div
      className={clsx(styles.Root, {
        [styles['Root-vertical']]: !nonTextual,
        [styles['Root-horizontal']]: nonTextual,
      }, className)}
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
                hasError: showErrorState,
                disabled: formDisabled || disabled,
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
        })
      )}
      {description && (
        <div className={styles.Description}>{description}</div>
      )}
    </div>
  );
};
