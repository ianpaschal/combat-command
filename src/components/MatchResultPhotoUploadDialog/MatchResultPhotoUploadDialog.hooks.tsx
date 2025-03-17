import { MatchResultId } from '~/api';
import { closeModal, openModal } from '~/modals';

export const useMatchResultPhotoUploadDialog = (matchResultId: MatchResultId) => {
  const id = `match-result-photo-upload-dialog-${matchResultId}`;
  return {
    id,
    open: () => openModal(id),
    close: () => closeModal(id),
  };
};
