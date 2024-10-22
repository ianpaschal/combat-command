import { ReactElement } from 'react';

export const getComponentName = (component: ReactElement): string => {
  if (typeof component === 'string') {
    return 'Text';
  }
  // If component is wrapped, the displayName or name of the function may still help
  // FIXME
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return component.type.displayName || component.type.name || 'Unknown';
};