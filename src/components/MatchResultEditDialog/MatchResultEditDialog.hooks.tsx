import { MatchResultId } from '~/api';
import { useModal } from '~/modals';

export const useMatchResultEditDialog = (matchResultId: MatchResultId) => useModal(`match-result-edit-dialog-${matchResultId}`);
