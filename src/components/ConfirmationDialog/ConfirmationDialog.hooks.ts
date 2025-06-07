import { useModal } from '~/modals';

export const useConfirmationDialog = (id: string) => useModal<{ onConfirm: () => void }>(id);
