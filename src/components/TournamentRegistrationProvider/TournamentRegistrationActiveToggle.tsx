import { TournamentRegistrationActionKey } from '~/api';
import { Switch } from '~/components/generic/Switch';
import { useTournamentRegistration } from './TournamentRegistrationProvider.hooks';

export const TournamentRegistrationActiveToggle = (): JSX.Element => {
  const { tournamentRegistration, actions } = useTournamentRegistration();

  const action = actions[TournamentRegistrationActionKey.ToggleActive];

  return (
    <Switch
      checked={tournamentRegistration.active}
      disabled={!action}
      onCheckedChange={() => action?.handler}
    />
  );
};
