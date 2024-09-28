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
  size?: number;
  countryCode?: string;
  onEdit?: () => void;
}

const cn = createCn('Avatar');

export const Avatar = ({
  avatarUrl,
  displayName,
  countryCode,
  size = 40,
  onEdit,
}: AvatarProps): JSX.Element => (
  <Root className={cn()} style={{ width: size, height: size }}>
    <Image
      className={cn('_Image')}
      src={avatarUrl}
      alt={displayName}
    />
    {!avatarUrl && (
      <Fallback className={cn('_Fallback')} delayMs={600}>
        <User />
      </Fallback>
    )}
    {onEdit && (
      <span onClick={onEdit}>

      </span>
    )}
    {countryCode && (
      <FlagCircle className={cn('_Flag')} code={countryCode} size={size / 3} />
    )}
  </Root>
);