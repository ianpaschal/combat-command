import { ReactElement } from 'react';

export const getComponentName = (component: ReactElement): string => {
  if (typeof component === 'string') {
    return 'Text';
  }
  // If component is wrapped, the displayName or name of the function may still help
  return component.type.displayName || component.type.name || 'Unknown';
};