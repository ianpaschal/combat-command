import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import { Root } from '@radix-ui/react-separator';
import clsx from 'clsx';

import styles from './Separator.module.scss';

type SeparatorRef = ElementRef<typeof Root>;
type SeparatorProps = ComponentPropsWithoutRef<typeof Root> & {
  text?: string;
};
export const Separator = forwardRef<SeparatorRef, SeparatorProps>(({
  className,
  text,
  orientation,
  ...props
}, ref) => (
  <div className={clsx(styles.Root, { [styles.RootWithText]: !!text }, className)} data-orientation={orientation}>
    <Root ref={ref} className={clsx(styles.Separator, className)} orientation={orientation} {...props} />
    {text && (
      <>
        <span className={styles.Text}>{text}</span>
        <Root ref={ref} className={clsx(styles.Separator, className)} orientation={orientation} {...props} />
      </>
    )}
  </div>
));
