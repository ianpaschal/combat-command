import { useModal } from '~/modals';

export const useUserSelectDialog = (id: string | number) => useModal(`user-select-dialog-${id}`);
