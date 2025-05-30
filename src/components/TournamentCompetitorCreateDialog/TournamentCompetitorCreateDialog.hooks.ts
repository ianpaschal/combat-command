import {
  closeModal,
  openModal,
  useModal,
} from '~/modals';

export const useTournamentCompetitorCreateDialog = () => {
  const id = 'tournament-competitor-create-dialog';
  const { data } = useModal(id);
  return {
    id,
    data,
    open: () => openModal(id),
    close: () => closeModal(id),
  };
};

export const createDialogHandlerHook = <T extends object>() => (key: string) => ({
  key,
  data: useModal<T>(key).data,
  open: (updated?: T) => openModal(key, updated),
  close: () => closeModal(key),
});
