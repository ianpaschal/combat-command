import { MatchResultId } from '~/api';
import { closeModal, openModal } from '~/modals';

export const useMatchResultDeleteDialog = (matchResultId: MatchResultId) => {
  const id = `match-result-delete-dialog-${matchResultId}`;
  return {
    id,
    open: () => openModal(id),
    close: () => closeModal(id),
  };
};
