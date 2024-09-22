import {
  Fallback,
  Image,
  Root,
} from '@radix-ui/react-avatar';
import { User } from 'lucide-react';

import { FlagCircle } from '~/components/generic/FlagCircle';
import { createCn } from '~/utils/componentLib/createCn';

import './Avatar.scss';

export interface AvatarProps {
  avatarUrl?: string;
  displayName?: string;
  size?: string | number;
  countryCode?: string;
  onEdit?: () => void;
}

const cn = createCn('Avatar');

export const Avatar = ({
  avatarUrl,
  displayName,
  countryCode,
  size = '2.5rem',
  onEdit,
}: AvatarProps): JSX.Element => (
  <Root className={cn()} style={{ width: size, height: size }}>
    <Image
      className={cn('__Image')}
      src={avatarUrl}
      alt={displayName}
    />
    <Fallback className={cn('__Fallback')} delayMs={600}>
      <User />
    </Fallback>

    {onEdit && (
      <span onClick={onEdit}>

      </span>
    )}
    {countryCode && (
      <FlagCircle className={cn('__Flag')} code={countryCode} size="0.875rem" />
    )}
  </Root>
);