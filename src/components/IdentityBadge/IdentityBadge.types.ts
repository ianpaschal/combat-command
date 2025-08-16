import { ReactElement } from 'react';

import { TournamentCompetitor, User } from '~/api';

export type Identity = {
  user?: User | null;
  competitor?: TournamentCompetitor | null;
  placeholder?: IdentityBadgePlaceholder;
};

export type IdentityBadgePlaceholder = {
  displayName?: string;
  icon?: ReactElement;
  allowClaim?: boolean;
};
