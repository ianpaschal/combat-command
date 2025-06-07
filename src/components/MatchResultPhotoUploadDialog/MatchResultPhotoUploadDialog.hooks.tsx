import { MatchResultId } from '~/api';
import { useModal } from '~/modals';

export const useMatchResultPhotoUploadDialog = (matchResultId: MatchResultId) => useModal(`match-result-photo-upload-dialog-${matchResultId}`);
