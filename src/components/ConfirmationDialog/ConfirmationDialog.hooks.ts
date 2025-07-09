import { useModal } from '~/modals';

type ConfirmationDialogData = {
  title?: string;
  description?: string;
  onConfirm: () => void;
};

export const useConfirmationDialog = (id?: string) => useModal<ConfirmationDialogData>(id);
