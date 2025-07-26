import { TournamentPairingId } from '~/api';
import { useModal } from '~/modals';

export const useMatchResultCreateDialog = () => useModal<{ tournamentPairingId: TournamentPairingId }>('match-result-create-dialog');
