import { cloneElement, ReactElement } from 'react';
import {
  Fallback,
  Image,
  Root,
} from '@radix-ui/react-avatar';
import clsx from 'clsx';
import { User } from 'lucide-react';

import { FlagCircle } from '~/components/generic/FlagCircle';
import { createCn } from '~/utils/componentLib/createCn';

import './Avatar.scss';

export interface BadgeConfig {
  position: 'top' | 'top-left' | 'top-right' | 'left' | 'right' | 'bottom' | 'bottom-left' | 'bottom-right';
  size?: string | number;
  element: ReactElement;
  overhang?: boolean;
}

export interface AvatarProps {
  avatarUrl?: string;
  displayName?: string;
  size?: number;
  countryCode?: string;
  onEdit?: () => void;
  badges?: BadgeConfig[];
  className?: string;
}

const cn = createCn('Avatar');

export const Avatar = ({
  avatarUrl,
  displayName,
  countryCode,
  className,
  size = 40,
  badges: badgeConfigs,
  onEdit,
}: AvatarProps): JSX.Element => {

  const badges = badgeConfigs?.map((config) => {
    const convertToPascalCase = (text: string): string => (
      text.replace(/(^\w|-\w)/g, (t) => t.replace(/-/, '').toUpperCase())
    );
    const className = clsx(
      'Badge',
      `Badge${convertToPascalCase(config.position)}`,
    );

    console.log(className);
    const style = config.size ? {
      // width: config.size,
      // height: config.size,
    } : undefined;
    return (
      <div className={className} style={style}>
        {cloneElement(config.element, { style })}
      </div>
    );
  });

  return (
    <Root className={clsx(cn(), className)} style={{ width: size, height: size }}>
      <div className={cn('_Content')}>
        {avatarUrl ? (
          <Image
            className={cn('_Image')}
            src={avatarUrl}
            alt={displayName}
          />
        ) : (
          <Fallback className={cn('_Fallback')} delayMs={600}>
            <User />
          </Fallback>
        )}
      </div>
      {onEdit && (
        <span onClick={onEdit}>

        </span>
      )}
      {badges}
      {countryCode && (
        <FlagCircle className={cn('_Flag')} code={countryCode} size={size / 3} />
      )}
    </Root>
  );
};