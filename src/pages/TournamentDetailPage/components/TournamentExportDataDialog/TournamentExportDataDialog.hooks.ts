import {
  closeModal,
  openModal,
  useModal,
} from '~/modals';

export const useTournamentExportDataDialog = () => {
  const id = 'tournament-export-data-dialog';
  const { data } = useModal(id);
  return {
    id,
    data,
    open: () => openModal(id),
    close: () => closeModal(id),
  };
};
