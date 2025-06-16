import { useWindowWidth } from '@react-hook/window-size/throttled';

// TODO: Give these better names (3-col, 2-col, etc.)
import {
  MIN_WIDTH_DESKTOP,
  MIN_WIDTH_TABLET,
  MOBILE_BREAKPOINT,
} from '~/settings';

export enum DeviceSize {
  'Mobile',
  'Narrow',
  'Default',
  'Wide',
}

export const useDeviceSize = (): [DeviceSize, 'wide' | 'default' | 'narrow' | 'mobile'] => {

  const windowWidth = useWindowWidth();

  if (windowWidth >= MIN_WIDTH_DESKTOP) {
    return [DeviceSize.Wide, 'wide'];
  }

  if (windowWidth >= MIN_WIDTH_TABLET) {
    return [DeviceSize.Default, 'default'];
  }

  if (windowWidth > MOBILE_BREAKPOINT) {
    return [DeviceSize.Narrow, 'narrow'];
  }

  return [DeviceSize.Mobile, 'mobile'];
};
