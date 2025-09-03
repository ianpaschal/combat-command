import {
  ComponentPropsWithoutRef,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import {
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { UseMutationResult } from '@tanstack/react-query';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { Button } from '~/components/generic/Button';
import { Form } from '~/components/generic/Form';

import styles from './Dialog.module.scss';

export interface DialogProps<T extends FieldValues> extends ComponentPropsWithoutRef<typeof Dialog.Root> {
  children?: ReactNode;
  trigger?: ReactNode;
  width?: 'small' | 'normal' | 'large';

  // Form stuff
  id: string;
  title: string;
  submitHook: UseMutationResult<void, Error, T, unknown>;
  form: UseFormReturn<T>;
  classNames?: {
    form?: string;
    trigger?: string;
  }
  submitLabel: string;
  preventCancel?: boolean;
}

export const FormDialog = <T extends FieldValues>({
  children,
  width = 'normal',
  preventCancel = false,
  title,
  trigger,
  open: controlledOpen = false,
  onOpenChange,

  // Form stuff
  id,
  submitHook,
  form,
  submitLabel,
  classNames,

  ...props
}: DialogProps<T>): JSX.Element => {

  // Control the state so we can use it with Framer Motion
  const [open, setOpen] = useState<boolean>(controlledOpen);

  // If the dialog is being controlled from outside, update outer state to match
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(open);
    }
  }, [onOpenChange, open]);

  // If the dialog is being controlled from outside, update inner state to match
  useEffect(() => {
    setOpen(controlledOpen);
  }, [controlledOpen]);

  // Reset the form when opening
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [form, open]);

  // Intercept onInteractOutside and block if dialog cannot be cancelled
  const handleInteractOutside = (e: { preventDefault: () => void; }): void => {
    if (preventCancel) {
      e.preventDefault();
    }
  };

  const handleSubmit: SubmitHandler<T> = async (data): Promise<void> => {
    submitHook.mutate(data, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const { isPending } = submitHook;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen} {...props}>
      {trigger && (
        <Dialog.Trigger asChild>
          {trigger}
        </Dialog.Trigger>
      )}
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay forceMount className={styles.Overlay} />
            <div className={styles.Positioner} tabIndex={-1}>
              <Dialog.Content
                className={clsx(styles.Content, { [styles[`Content-${width}`]]: true })}
                aria-describedby={undefined}
                onInteractOutside={handleInteractOutside}
                asChild
                forceMount
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ ease: 'easeInOut', duration: 0.15 }}
                >
                  <div className={styles.Header}>
                    <Dialog.Title>
                      {title}
                    </Dialog.Title>
                    {!preventCancel && (
                      <Dialog.Close className={styles.Close}>
                        <X />
                      </Dialog.Close>
                    )}
                  </div>
                  <div className={styles.Inner}>
                    <Form id={id} className={classNames?.form} form={form} onSubmit={handleSubmit}>
                      {children}
                    </Form>
                  </div>
                  <div className={styles.Footer}>
                    {!preventCancel && (
                      <Dialog.Close asChild>
                        <Button variant="secondary" disabled={isPending}>Cancel</Button>
                      </Dialog.Close>
                    )}
                    <Button disabled={isPending} loading={isPending} type="submit" form={id}>
                      {submitLabel}
                    </Button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};
