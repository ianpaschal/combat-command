import { Separator } from '~/components/generic/Separator';
import { TournamentPairingsList } from '~/components/TournamentPairingsList';
import { TournamentRoundTimer } from '~/components/TournamentRoundTimer';

import { TournamentDetailsCard } from './TournamentDetailsCard';
import { TournamentTabHeader } from './TournamentTabHeader';

import styles from './TournamentActiveRoundCard.module.scss';

export const TournamentActiveRoundCard = () => (
  <TournamentDetailsCard>
    <TournamentRoundTimer className={styles.Timer} />
    <Separator />
    <TournamentTabHeader title="Pairings" />
    <TournamentPairingsList />
  </TournamentDetailsCard >
);
