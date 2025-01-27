import React, { forwardRef } from 'react';

export const Item = forwardRef(({ children, ...props }, ref) => (
  <div {...props} ref={ref}>{children}</div>
));