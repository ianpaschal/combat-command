import { TournamentRegistration, TournamentRegistrationActionKey } from '~/api';
import { ContextMenu } from '~/components/ContextMenu';
import { useActions } from './TournamentRegistrationProvider.hooks';

export interface TournamentRegistrationContextMenuProps {
  className?: string;
  tournamentRegistration: TournamentRegistration;
}

export const TournamentRegistrationContextMenu = ({
  className,
  tournamentRegistration,
}: TournamentRegistrationContextMenuProps): JSX.Element => {
  const actions = useActions(tournamentRegistration);
  return (
    <ContextMenu className={className} actions={[
      actions[TournamentRegistrationActionKey.ToggleActive],
      actions[TournamentRegistrationActionKey.Delete],
    ].filter(Boolean)} />
  );
};
