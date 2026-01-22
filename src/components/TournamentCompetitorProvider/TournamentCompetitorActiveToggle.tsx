import { TournamentCompetitor } from '~/api';
import { Switch } from '~/components/generic/Switch';
import { useToggleActiveAction } from './actions/useToggleActiveAction';

export interface TournamentCompetitorActiveToggleProps {
  className?: string;
  tournamentCompetitor: TournamentCompetitor;
}

export const TournamentCompetitorActiveToggle = ({
  className,
  tournamentCompetitor,
}: TournamentCompetitorActiveToggleProps): JSX.Element => {
  const action = useToggleActiveAction(tournamentCompetitor);
  return (
    <Switch
      className={className}
      checked={tournamentCompetitor.active}
      disabled={!action}
      onCheckedChange={() => action?.handler()}
    />
  );
};
