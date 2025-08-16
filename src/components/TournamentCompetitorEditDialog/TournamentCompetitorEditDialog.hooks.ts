import { TournamentCompetitor } from '~/api';
import {
  closeModal,
  openModal,
  useModal,
} from '~/modals';

export type UseTournamentCompetitorEditDialogData = {
  tournamentCompetitor: TournamentCompetitor;
};

export const useTournamentCompetitorEditDialog = () => {
  const id = 'tournament-competitor-edit-dialog';
  const { data } = useModal<UseTournamentCompetitorEditDialogData>(id);
  return {
    id,
    data,
    open: (data?: UseTournamentCompetitorEditDialogData) => openModal(id, data),
    close: () => closeModal(id),
  };
};
