import { TournamentId } from '~/api';
import { closeModal, openModal } from '~/modals';

export const useTournamentCreateTeamDialog = (tournamentId: TournamentId) => {
  const id = `tournament-create-team-dialog-${tournamentId}`;
  return {
    id,
    open: () => openModal(id),
    close: () => closeModal(id),
  };
};
