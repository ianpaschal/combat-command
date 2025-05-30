import { ReactElement } from 'react';

import { TournamentCompetitor, User } from '~/api';

export type IdentityBadgeInput = {
  user?: User;
  competitor?: TournamentCompetitor;
  placeholder?: IdentityBadgePlaceholder;
};

export type IdentityBadgePlaceholder = {
  displayName: string;
  icon?: ReactElement;
  allowClaim?: boolean;
};
