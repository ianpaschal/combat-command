import { createContext, MouseEvent } from 'react';

import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';

export type Action = {
  handler: (e: MouseEvent) => void;
  label: string;
};

export type ActionDefinition = Action & {
  key: TournamentCompetitorActionKey;
};

export type TournamentCompetitorActions = Partial<Record<TournamentCompetitorActionKey, Action>>;

export type TournamentCompetitorContextValue = {
  tournamentCompetitor: TournamentCompetitor | null;
  actions: TournamentCompetitorActions;
};

export const TournamentCompetitorContext = createContext<TournamentCompetitorContextValue>({
  tournamentCompetitor: null,
  actions: {},
});
