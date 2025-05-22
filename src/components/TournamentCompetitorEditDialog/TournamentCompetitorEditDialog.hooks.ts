import { TournamentCompetitor } from '~/api';
import {
  closeModal,
  openModal,
  useModal,
} from '~/modals';

export type UseTournamentCompetitorEditDialogData = {
  tournamentCompetitor: TournamentCompetitor;
};

export const useTournamentCompetitorEditDialog = () => {
  const id = 'tournament-competitor-edit-dialog';
  const { data } = useModal<UseTournamentCompetitorEditDialogData>(id);
  return {
    id,
    data,
    open: (updated: UseTournamentCompetitorEditDialogData) => openModal(id, updated),
    close: () => closeModal(id),
  };
};

export const createDialogHandlerHook = <T extends object>() => (key: string) => ({
  key,
  data: useModal<T>(key).data,
  open: (updated?: T) => openModal(key, updated),
  close: () => closeModal(key),
});
