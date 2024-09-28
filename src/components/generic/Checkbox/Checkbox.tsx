import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Indicator, Root } from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { Check } from 'lucide-react';

import { ElementSize, ElementVariant } from '~/types/componentLib';
import { createCn } from '~/utils/componentLib/createCn';

import './Checkbox.scss';

const cn = createCn('Checkbox');

type CheckboxRef = ElementRef<typeof Root>;
type CheckboxProps = ComponentPropsWithoutRef<typeof Root> & {
  value?: boolean;
  onChange?: (checked: boolean) => void;
  size?: ElementSize;
  variant?: ElementVariant;
  hasError?: boolean;
};
export const Checkbox = forwardRef<CheckboxRef, CheckboxProps>(({
  className,
  disabled,
  size = 'tiny',
  variant = 'solid',
  value,
  onChange,
  hasError,
  ...props
}, ref) => (
  <Root
    ref={ref}
    className={clsx(cn(), cn(`-${variant}`), cn(`-size-${size}`), { [cn('-disabled')]: disabled }, className)}
    checked={value}
    onCheckedChange={onChange}
    {...props}
  >
    <Indicator className={clsx(cn('_Indicator'), cn(`_Indicator-${variant}`))}>
      <Check />
    </Indicator>
  </Root>
));
Checkbox.displayName = Root.displayName;