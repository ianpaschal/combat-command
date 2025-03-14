import { MatchResultId } from '~/api';
import { closeModal, openModal } from '~/modals';

export const useMatchResultEditDialog = (matchResultId: MatchResultId) => {
  const id = `match-result-edit-dialog-${matchResultId}`;
  return {
    id,
    open: () => openModal(id),
    close: () => closeModal(id),
  };
};
