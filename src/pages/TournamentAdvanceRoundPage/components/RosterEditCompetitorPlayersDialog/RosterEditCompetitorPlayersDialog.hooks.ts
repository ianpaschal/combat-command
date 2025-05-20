import {
  closeModal,
  openModal,
  useModal,
} from '~/modals';
import { RosterEditCompetitorPlayersDialogProps } from '~/pages/TournamentAdvanceRoundPage/components/RosterEditCompetitorPlayersDialog/RosterEditCompetitorPlayersDialog';

export const useRosterEditCompetitorPlayersDialog = () => {
  const id = 'roster-edit-competitor-players-dialog';
  const { data } = useModal<RosterEditCompetitorPlayersDialogProps>(id);
  return {
    id,
    data,
    open: (newData: RosterEditCompetitorPlayersDialogProps) => openModal(id, newData),
    close: () => closeModal(id),
  };
};
