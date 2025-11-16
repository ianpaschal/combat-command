import { ContextMenu, ContextMenuProps } from '~/components/ContextMenu';
import { useTournamentRegistration } from './TournamentRegistrationProvider.hooks';

export type TournamentRegistrationContextMenuProps = Omit<ContextMenuProps, 'actions'>;

export const TournamentRegistrationContextMenu = (
  props: Omit<ContextMenuProps, 'actions'>,
): JSX.Element => {
  const { actions } = useTournamentRegistration();
  return (
    <ContextMenu {...props} actions={actions} />
  );
};
