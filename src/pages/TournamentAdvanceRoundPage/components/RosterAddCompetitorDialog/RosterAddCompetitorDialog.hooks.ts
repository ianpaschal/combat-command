import { closeModal, openModal } from '~/modals';

export const useRosterAddCompetitorDialog = () => {
  const id = 'roster-add-competitor-dialog';
  return {
    id,
    open: () => openModal(id),
    close: () => closeModal(id),
  };
};
