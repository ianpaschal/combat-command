import { MouseEvent } from 'react';

import {
  TournamentActionKey,
  TournamentCompetitorActionKey,
  TournamentRegistrationActionKey,
} from '~/api';

export type Action = {
  handler: (e: MouseEvent) => void;
  label: string;
};

export type ActionKey = TournamentActionKey | TournamentCompetitorActionKey | TournamentRegistrationActionKey;
