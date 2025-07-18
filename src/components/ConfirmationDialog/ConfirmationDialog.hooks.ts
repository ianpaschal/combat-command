import { useModal } from '~/modals';
import { ConfirmationDialogData } from './ConfirmationDialog.types';

export const useConfirmationDialog = (id?: string) => useModal<ConfirmationDialogData>(id);
