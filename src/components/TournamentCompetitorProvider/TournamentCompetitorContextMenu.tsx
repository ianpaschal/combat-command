import { TournamentCompetitor, TournamentCompetitorActionKey } from '~/api';
import { ContextMenu } from '~/components/ContextMenu';
import { useActions } from './TournamentCompetitorProvider.hooks';

export interface TournamentCompetitorContextMenuProps {
  className?: string;
  tournamentCompetitor: TournamentCompetitor;
}

export const TournamentCompetitorContextMenu = ({
  className,
  tournamentCompetitor,
}: TournamentCompetitorContextMenuProps): JSX.Element => {
  const actions = useActions(tournamentCompetitor);
  return (
    <ContextMenu className={className} actions={[
      actions[TournamentCompetitorActionKey.Edit],
      actions[TournamentCompetitorActionKey.ToggleActive],
      actions[TournamentCompetitorActionKey.Delete],
      actions[TournamentCompetitorActionKey.Join],
      actions[TournamentCompetitorActionKey.Leave],
      actions[TournamentCompetitorActionKey.AddPlayer],
    ].filter(Boolean)} />
  );
};
