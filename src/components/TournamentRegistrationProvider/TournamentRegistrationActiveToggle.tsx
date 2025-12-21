import { TournamentRegistration } from '~/api';
import { Switch } from '~/components/generic/Switch';
import { useToggleActiveAction } from './actions/useToggleActiveAction';

export interface TournamentRegistrationActiveToggleProps {
  className?: string;
  tournamentRegistration: TournamentRegistration;
}

export const TournamentRegistrationActiveToggle = ({
  className,
  tournamentRegistration,
}: TournamentRegistrationActiveToggleProps): JSX.Element => {
  const action = useToggleActiveAction(tournamentRegistration);
  return (
    <Switch
      className={className}
      checked={tournamentRegistration.active}
      disabled={!action}
      onCheckedChange={() => action?.handler()}
    />
  );
};
