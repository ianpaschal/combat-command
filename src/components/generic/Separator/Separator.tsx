import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { Separator as RadixSeparator } from 'radix-ui';

import styles from './Separator.module.scss';

type SeparatorRef = ElementRef<typeof RadixSeparator.Root>;
type SeparatorProps = ComponentPropsWithoutRef<typeof RadixSeparator.Root> & {
  text?: string;
};
export const Separator = forwardRef<SeparatorRef, SeparatorProps>(({
  className,
  text,
  orientation,
  ...props
}, ref) => (
  <div className={clsx(styles.Root, { [styles.RootWithText]: !!text }, className)} data-orientation={orientation}>
    <RadixSeparator.Root ref={ref} className={clsx(styles.Separator, className)} orientation={orientation} {...props} />
    {text && (
      <>
        <span className={styles.Text}>{text}</span>
        <RadixSeparator.Root ref={ref} className={clsx(styles.Separator, className)} orientation={orientation} {...props} />
      </>
    )}
  </div>
));
