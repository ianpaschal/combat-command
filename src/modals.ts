import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

interface Modal<T extends object> {
  id: string;
  data: T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const openModals = new Store<Modal<any>[]>([]);

export const openModal = <T extends object>(id: string, data?: T): void => {
  openModals.setState((state) => [
    ...state,
    { id, data },
  ]);
};

export const closeModal = (id: string): void => {
  const existingIds = openModals.state.map((modal) => modal.id);
  if (existingIds.includes(id)) {
    throw new Error(`Modal with ID ${id} already registered! Make sure each modal has a unique ID.`);
  }
  openModals.setState((state) => state.filter((modal) => modal.id !== id));
};

export const useModal = <T extends object>(id: string) => {
  const modal: Modal<T> | undefined = useStore(openModals, (state) => state.find((openModal) => openModal.id === id));
  return modal || { open: false, id, data: undefined };
};

export const useModalVisible = (id: string) => {
  const modal = useStore(openModals, (state) => state.find((openModal) => openModal.id === id));
  return !!modal;
};
