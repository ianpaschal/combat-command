import { useTournament } from '~/components/TournamentProvider';
import { TournamentTimer } from '~/components/TournamentTimer';
import { DeviceSize, useDeviceSize } from '~/hooks/useDeviceSize';
import { getTournamentDisplayName } from '~/utils/common/getTournamentDisplayName';

import styles from './TournamentDetailBanner.module.scss';

export const TournamentDetailBanner = (): JSX.Element => {
  const tournament = useTournament();
  const [deviceSize] = useDeviceSize();

  const showTimer = tournament.status === 'active' && tournament.currentRound !== undefined;
  const compact = deviceSize < DeviceSize.Default;

  return (
    <div className={styles.TournamentDetailBanner} data-compact={compact} data-timer={showTimer}>
      <div className={styles.TournamentDetailBanner_Title}>
        {tournament.logoUrl && (
          <img className={styles.TournamentDetailBanner_Logo} src={tournament.logoUrl} />
        )}
        <h1>{getTournamentDisplayName(tournament)}</h1>
      </div>
      {showTimer && (
        <div className={styles.TournamentDetailBanner_TimerSection}>
          <TournamentTimer />
        </div>
      )}
    </div>
  );
};
