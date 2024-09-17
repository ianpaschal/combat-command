import { ReactElement } from 'react';
import clsx from 'clsx';

import './Animate.scss';

export interface AnimateProps {
  children: ReactElement;
  show?: boolean;
  speed?: 'quick' | 'slow';
  style?: 'pop';
}

export const Animate = ({
  children,
  show = false,
  speed = 'quick',
  style = 'pop',
}: AnimateProps): JSX.Element => (
  <div
    className={clsx('Animated', `Animated--speed-${speed}`, `Animated--style-${style}`)}
    data-state={show ? 'open' : 'closed'}
  >
    {children}
  </div>
);

// TODO: There shouldn't be a need for a separate div, but data-state doesn't seem possible to set
// const enhancedChildren = Children.map(children, child =>
//   cloneElement(child, {
//     className: clsx(child.props.className, 'Animated', `Animated--speed-${speed}`, `Animated--style-${style}`),
//     'data-state': show ? 'open' : 'closed',
//   }),
// );
