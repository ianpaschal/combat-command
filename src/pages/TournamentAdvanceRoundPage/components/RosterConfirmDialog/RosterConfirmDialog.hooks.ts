import { closeModal, openModal } from '~/modals';

export const useRosterConfirmDialog = () => {
  const id = 'roster-confirm-dialog';
  return {
    id,
    open: () => openModal(id),
    close: () => closeModal(id),
  };
};
