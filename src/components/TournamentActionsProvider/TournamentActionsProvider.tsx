import { ReactNode } from 'react';

import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { TournamentActionsContext } from './TournamentActionsProvider.context';
import { useActions } from './TournamentActionsProvider.hooks';

export interface TournamentActionsProviderProps {
  children: ReactNode;
}

export const TournamentActionsProvider = ({
  children,
}: TournamentActionsProviderProps) => {
  const { id, open } = useConfirmationDialog();
  const actions = useActions(open);
  return (
    <TournamentActionsContext.Provider value={actions}>
      {children}
      <ConfirmationDialog id={id} />
    </TournamentActionsContext.Provider>
  );
};
