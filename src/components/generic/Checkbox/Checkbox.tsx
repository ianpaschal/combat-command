import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import { Checkbox as RadixCheckbox } from 'radix-ui';

import { ElementSize, ElementVariant } from '~/types/componentLib';
import { createCn } from '~/utils/componentLib/createCn';

import './Checkbox.scss';

const cn = createCn('Checkbox');

type CheckboxRef = ElementRef<typeof RadixCheckbox.Root>;
type CheckboxProps = Omit<ComponentPropsWithoutRef<typeof RadixCheckbox.Root>, 'value' | 'onChange'> & {
  loading?: boolean;
  onChange?: (checked: boolean) => void;
  size?: ElementSize;
  value?: boolean;
  variant?: ElementVariant;
};

export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>(({
  className,
  disabled,
  loading: _,
  onChange,
  size = 'tiny',
  value,
  variant = 'solid',
  ...props
}, ref) => (
  <RadixCheckbox.Root
    ref={ref}
    className={clsx(cn(), cn(`-${variant}`), cn(`-size-${size}`), { [cn('-disabled')]: disabled }, className)}
    checked={value}
    onCheckedChange={onChange}
    {...props}
  >
    <RadixCheckbox.Indicator className={clsx(cn('_Indicator'), cn(`_Indicator-${variant}`))}>
      <Check />
    </RadixCheckbox.Indicator>
  </RadixCheckbox.Root>
));
Checkbox.displayName = RadixCheckbox.Root.displayName;
