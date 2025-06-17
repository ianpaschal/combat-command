import { useTournament } from '~/components/TournamentProvider';
import { TournamentTimer } from '~/components/TournamentTimer';
import { DeviceSize, useDeviceSize } from '~/hooks/useDeviceSize';

import styles from './TournamentDetailBanner.module.scss';

export const TournamentDetailBanner = (): JSX.Element => {
  const { title, logoUrl, currentRound, status } = useTournament();
  const [deviceSize] = useDeviceSize();

  const showTimer = status === 'active' && currentRound !== undefined;
  const compact = deviceSize < DeviceSize.Default;

  return (
    <div className={styles.TournamentDetailBanner} data-compact={compact} data-timer={showTimer}>
      <div className={styles.TournamentDetailBanner_Title}>
        {logoUrl && (
          <img className={styles.TournamentDetailBanner_Logo} src={logoUrl} />
        )}
        <h1>{title}</h1>
      </div>
      {showTimer && (
        <div className={styles.TournamentDetailBanner_TimerSection}>
          <TournamentTimer />
        </div>
      )}
    </div>
  );
};
