import { TournamentRegistrationId } from '~/api';
import { useModal } from '~/modals';

export const useListCreateDialog = () => useModal<{ tournamentRegistrationId: TournamentRegistrationId }>('list-create');
