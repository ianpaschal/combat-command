import {
  closeModal,
  openModal,
  useModal,
} from '~/modals';

export const useTournamentCompetitorCreateDialog = () => {
  const id = 'tournament-competitor-create-dialog';
  const { data } = useModal(id);
  return {
    id,
    data,
    open: () => openModal(id),
    close: () => closeModal(id),
  };
};
