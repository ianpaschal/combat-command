import {
  ForwardedRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal';
  gap?: number | string;
  verticalAlign?: 'start' | 'center' | 'end';
  horizontalAlign?: 'start' | 'center' | 'end';
  children: ReactNode;
  className?: string;
  ref?: ForwardedRef<HTMLDivElement>;
}

export const Stack = ({
  orientation = 'vertical',
  className,
  gap = '1rem',
  verticalAlign = 'center',
  horizontalAlign = 'center',
  children,
}: StackProps): JSX.Element => {
  // Easier to build the style object here
  const baseStyle = {
    display: 'flex',
    gap,
  };
  const verticalStyle = {
    ...baseStyle,
    flexDirection: 'column' as const,
    justifyContent: verticalAlign,
    alignItems: horizontalAlign,
  };
  const horizontalStyle = {
    ...baseStyle,
    flexDirection: 'row' as const,
    justifyContent: horizontalAlign,
    alignItems: verticalAlign,
  };
  return (
    <div className={className} style={orientation === 'vertical' ? verticalStyle : horizontalStyle}>
      {children}
    </div>
  );
};