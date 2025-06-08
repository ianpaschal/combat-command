import { useWindowWidth } from '@react-hook/window-size/throttled';

import {
  MIN_WIDTH_DESKTOP,
  MIN_WIDTH_TABLET,
  MOBILE_BREAKPOINT,
} from '~/settings';

export enum DeviceSize {
  'Mobile',
  'Default',
  'Tablet',
  'Desktop',
}

export const useDeviceSize = (): [DeviceSize, string] => {

  const windowWidth = useWindowWidth();

  if (windowWidth >= MIN_WIDTH_DESKTOP) {
    return [DeviceSize.Desktop, 'desktop'];
  }

  if (windowWidth >= MIN_WIDTH_TABLET) {
    return [DeviceSize.Tablet, 'tablet'];
  }

  if (windowWidth <= MOBILE_BREAKPOINT) {
    return [DeviceSize.Mobile, 'mobile'];
  }

  return [DeviceSize.Default, 'default'];
};
