import { MouseEvent } from 'react';

import {
  TournamentActionKey,
  TournamentCompetitorActionKey,
  TournamentRegistrationActionKey,
} from '~/api';
import { ElementIntent } from '~/types/componentLib';

export type Action = {
  handler: (e?: MouseEvent) => void;
  label: string;
  icon?: JSX.Element;
  intent?: ElementIntent;
};

export type ActionKey = TournamentActionKey | TournamentCompetitorActionKey | TournamentRegistrationActionKey;

export type ActionDefinition<T extends ActionKey> = Action & {
  key: T;
};
