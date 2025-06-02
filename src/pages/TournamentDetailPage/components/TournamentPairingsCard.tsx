import { TournamentPairingsList } from '~/components/TournamentPairingsList';

import { TournamentDetailsCard } from './TournamentDetailsCard';

export const TournamentPairingsCard = () => (
  <TournamentDetailsCard title="Pairings">
    <TournamentPairingsList />
  </TournamentDetailsCard >
);
