import { UserId } from '~/api';
import { useModal } from '~/modals';

export interface UserSelectDialogData {
  userId?: UserId;
  placeholder?: string;
}

export const useUserSelectDialog = (id: string | number) => useModal<UserSelectDialogData>(`user-select-dialog-${id}`);
