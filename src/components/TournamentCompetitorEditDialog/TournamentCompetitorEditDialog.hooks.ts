import { TournamentCompetitor, TournamentCompetitorId } from '~/api';
import {
  closeModal,
  openModal,
  useModal,
} from '~/modals';

export type UseTournamentCompetitorEditDialogData = {
  tournamentCompetitor: TournamentCompetitor;
};

export const useTournamentCompetitorEditDialog = (id?: TournamentCompetitorId) => {
  const dialogId = `tournament-competitor-edit-dialog-${id ?? 'new'}`;
  const { data } = useModal<UseTournamentCompetitorEditDialogData>(dialogId);
  return {
    id: dialogId,
    data,
    open: (data?: UseTournamentCompetitorEditDialogData) => openModal(dialogId, data),
    close: () => closeModal(dialogId),
  };
};
