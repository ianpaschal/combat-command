import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  HTMLAttributes,
} from 'react';
import { Close, Title } from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { X } from 'lucide-react';

import './DrawerHeader.scss';

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right' | 'top' | 'bottom';
  border?: boolean;
}

export const DrawerHeader = ({
  side = 'right',
  className,
  title,
  border = false,
  children,
  ...props
}: DrawerHeaderProps): JSX.Element => (
  <div className={clsx('DrawerHeader', `DrawerHeader-${side}`, { 'DrawerHeader-border': border }, className)} {...props}>
    {title && (
      <DrawerTitle>{title}</DrawerTitle>
    )}
    {children}
    <Close className="DrawerHeaderClose">
      <X />
    </Close>
  </div>
);

type DialogTitleRef = ElementRef<typeof Title>;
type DialogTitleProps = ComponentPropsWithoutRef<typeof Title>;
export const DrawerTitle = forwardRef<DialogTitleRef, DialogTitleProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <Title ref={ref} className={clsx('DrawerTitle', className)} {...props} />
));