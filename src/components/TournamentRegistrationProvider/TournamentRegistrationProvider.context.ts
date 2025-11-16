import { createContext } from 'react';

import { TournamentRegistration, TournamentRegistrationActionKey } from '~/api';
import { Action } from '~/components/ContextMenu';

export type ActionDefinition = Action & {
  key: TournamentRegistrationActionKey;
};

export type TournamentRegistrationActions = Partial<Record<TournamentRegistrationActionKey, Action>>;

export type TournamentRegistrationContextValue = {
  tournamentRegistration: TournamentRegistration;
  actions: TournamentRegistrationActions;
} | null;

export const TournamentRegistrationContext = createContext<TournamentRegistrationContextValue>(null);
