import { TournamentCompetitor } from '~/api';
import { useModal } from '~/modals';

export type UseRosterConfirmDialogData = {
  inactive: TournamentCompetitor[];
  active: TournamentCompetitor[];
};

export const useRosterConfirmDialog = () => useModal<UseRosterConfirmDialogData>('roster-confirm-dialog');
