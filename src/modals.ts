import { useStore } from '@tanstack/react-store';
import { Store } from '@tanstack/store';

interface Modal {
  id: string;
  open: boolean;
  data: object;
}

export const openModals = new Store<Modal[]>([]);

export const openModal = (id: string, data = {}): void => {
  openModals.setState((state) => {
    const index = state.findIndex((openModal) => openModal.id === id);
    if (index === -1) {
      return [...state, { id, open: true, data }];
    }
    return [
      ...state.slice(0, index),
      { id, open: true, data },
      ...state.slice(index + 1, state.length),
    ];
  });
};

export const closeModal = (id: string): void => {
  openModals.setState((state) => {
    const index = state.findIndex((openModal) => openModal.id === id);
    return [
      ...state.slice(0, index),
      { id, open: false, data: {} },
      ...state.slice(index + 1, state.length),
    ];
  });
};

export const useModal = (id: string) => {
  const modal = useStore(openModals, (state) => state.find((openModal) => openModal.id === id));
  return modal || { open: false, id, data: {} };
};

export const useModalVisible = (id: string) => {
  const modal = useStore(openModals, (state) => state.find((openModal) => openModal.id === id));
  return modal?.open || false;
};
