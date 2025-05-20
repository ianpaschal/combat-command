import { UserId } from '~/api';
import {
  closeModal,
  openModal,
  useModal,
} from '~/modals';

export interface UserSelectDialogData {
  userId?: UserId;
  placeholder?: string;
}

export const useUserSelectDialog = (key?: string | number) => {
  const id = `user-select-dialog-${key}`;
  const { data } = useModal<UserSelectDialogData>(id);
  return {
    id,
    data,
    open: (data: Partial<UserSelectDialogData>) => openModal(id, data),
    close: () => closeModal(id),
  };
};
