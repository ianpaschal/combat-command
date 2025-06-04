import { ReactElement } from 'react';

import {
  TournamentCompetitor,
  TournamentCompetitorId,
  User,
  UserId,
} from '~/api';

export type IdentityBadgeInput = {
  user?: User;
  competitor?: TournamentCompetitor;
  placeholder?: IdentityBadgePlaceholder;
};

export type Identity = {
  userId?: UserId;
  user?: User;
  competitor?: TournamentCompetitor;
  competitorId?: TournamentCompetitorId;
  placeholder?: IdentityBadgePlaceholder;
};

export type IdentityBadgePlaceholder = {
  displayName: string;
  icon?: ReactElement;
  allowClaim?: boolean;
};
