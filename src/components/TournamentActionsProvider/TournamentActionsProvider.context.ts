import { createContext, MouseEvent } from 'react';

import { TournamentActionKey } from '~/api';

export type Action = {
  handler: (e: MouseEvent) => void;
  label: string;
};

export type TournamentActions = Partial<Record<TournamentActionKey, Action>>;

export const TournamentActionsContext = createContext<TournamentActions | null>(null);
