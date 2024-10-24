import {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from 'react';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';

import styles from './Spinner.module.scss';

type SpinnerRef = ElementRef<typeof LoaderCircle>;
type SpinnerProps = ComponentPropsWithoutRef<typeof LoaderCircle>;
export const Spinner = forwardRef<SpinnerRef, SpinnerProps>(({
  className,
  ...props
}, ref) => (
  <LoaderCircle className={clsx(styles.Icon, className)} ref={ref} {...props} />
));