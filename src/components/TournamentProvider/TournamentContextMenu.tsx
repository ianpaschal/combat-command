import { Tournament, TournamentActionKey } from '~/api';
import { ContextMenu } from '~/components/ContextMenu';
import { ElementSize } from '~/types/componentLib';
import { useActions } from './TournamentProvider.hooks';

export interface TournamentContextMenuProps {
  className?: string;
  tournament: Tournament;
  size?: ElementSize;
}

export const TournamentContextMenu = ({
  className,
  tournament,
  size,
}: TournamentContextMenuProps): JSX.Element => {
  const actions = useActions(tournament);
  return (
    <ContextMenu
      className={className}
      size={size}
      actions={[

        // CRUD
        actions[TournamentActionKey.Edit],
        actions[TournamentActionKey.Delete],

        // Lifecycle
        actions[TournamentActionKey.Publish],
        actions[TournamentActionKey.Cancel],
        actions[TournamentActionKey.Start],
        actions[TournamentActionKey.ConfigureRound],
        actions[TournamentActionKey.StartRound],
        actions[TournamentActionKey.UndoStartRound],
        actions[TournamentActionKey.SubmitMatchResult],
        actions[TournamentActionKey.EndRound],
        actions[TournamentActionKey.UndoEndRound],
        actions[TournamentActionKey.End],

        // Add Player / Join / Leave
        actions[TournamentActionKey.AddPlayer],
        actions[TournamentActionKey.Join],
        actions[TournamentActionKey.Leave],

      ].filter(Boolean)}
    />
  );
};
