import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  HTMLAttributes,
} from 'react';
import {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Title,
} from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { X } from 'lucide-react';

import { Stack } from '~/components/generic/Stack';

import './Dialog.scss';

type DialogTitleRef = ElementRef<typeof Title>;
type DialogTitleProps = ComponentPropsWithoutRef<typeof Title>;
export const DialogTitle = forwardRef<DialogTitleRef, DialogTitleProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <Title ref={ref} className={clsx('DialogTitle', className)} {...props} />
));

type DialogDescriptionRef = ElementRef<typeof Description>;
type DialogDescriptionProps = ComponentPropsWithoutRef<typeof Description>;
export const DialogDescription = forwardRef<DialogDescriptionRef, DialogDescriptionProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <Description ref={ref} className={clsx('DialogDescription', className)} {...props} />
));