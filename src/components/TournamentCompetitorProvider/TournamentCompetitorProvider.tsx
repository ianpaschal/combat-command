import { ReactNode } from 'react';

import { TournamentCompetitor } from '~/api';
import { ConfirmationDialog, useConfirmationDialog } from '~/components/ConfirmationDialog';
import { TournamentCompetitorEditDialog } from '~/components/TournamentCompetitorEditDialog';
import { TournamentCompetitorContext } from './TournamentCompetitorProvider.context';
import { useActions } from './TournamentCompetitorProvider.hooks';

export interface TournamentCompetitorProviderProps {
  children: ReactNode;
  tournamentCompetitor: TournamentCompetitor;
}

export const TournamentCompetitorProvider = ({
  children,
  tournamentCompetitor,
}: TournamentCompetitorProviderProps) => {
  const { id, open } = useConfirmationDialog();
  const actions = useActions(tournamentCompetitor, open);
  return (
    <TournamentCompetitorContext.Provider value={{ tournamentCompetitor, actions }}>
      {children}
      <ConfirmationDialog id={id} />
      <TournamentCompetitorEditDialog competitor={tournamentCompetitor} />
    </TournamentCompetitorContext.Provider>
  );
};
