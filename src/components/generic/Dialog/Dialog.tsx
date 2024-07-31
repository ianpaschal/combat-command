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

import './Dialog.scss';

type DialogOverlayRef = ElementRef<typeof Overlay>;
type DialogOverlayProps = ComponentPropsWithoutRef<typeof Overlay>;
export const DialogOverlay = forwardRef<DialogOverlayRef, DialogOverlayProps>(({
  className,
  ...props
}, ref): JSX.Element => (
  <Overlay ref={ref} className={clsx('DialogOverlay', className)} {...props} />
));

type DialogBodyRef = ElementRef<typeof Content>;
type DialogBodyProps = ComponentPropsWithoutRef<typeof Content> & {
  title: string;
  description?: string;
};
export const DialogContent = forwardRef<DialogBodyRef, DialogBodyProps>(({
  className,
  children,
  title,
  description,
  ...props
}, ref): JSX.Element => (
  <Portal>
    <DialogOverlay />
    <div className="DialogPositioner">
      <Content ref={ref} className={clsx('DialogContent', className)} {...props}>
        <div className={'DialogHeader'}>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
          <Close className={clsx('DialogClose', 'IconButton-ghost', 'IconButton-tiny')}>
            <X />
          </Close>
        </div>
        {children}
      </Content>
    </div>
  </Portal>
));

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

interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> { }
export const DialogFooter = ({
  className,
  ...props
}: DialogFooterProps): JSX.Element => (
  <div className={clsx('DialogFooter', className)} {...props} />
);