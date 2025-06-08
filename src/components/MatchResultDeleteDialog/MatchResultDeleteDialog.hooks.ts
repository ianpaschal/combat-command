import { MatchResultId } from '~/api';
import { useModal } from '~/modals';

export const useMatchResultDeleteDialog = (matchResultId: MatchResultId) => useModal(`match-result-delete-dialog-${matchResultId}`);
