import {
  Fallback,
  Image,
  Root,
} from '@radix-ui/react-avatar';
import { User } from 'lucide-react';

import './Avatar.scss';

export interface AvatarProps {
  avatarUrl?: string;
  displayName: string;
  size?: string | number;
  onEdit?: () => void;
}

export const Avatar = ({
  avatarUrl,
  displayName,
  size = '2.5rem',
  onEdit,
}: AvatarProps): JSX.Element => (
  <Root className="AvatarRoot" style={{ width: size, height: size }}>
    <Image
      className="AvatarImage"
      src={avatarUrl}
      alt={displayName}
    />
    <Fallback className="AvatarFallback" delayMs={600}>
      <User />
    </Fallback>
    {onEdit && (
      <span onClick={onEdit}>

      </span>
    )}
  </Root>
);