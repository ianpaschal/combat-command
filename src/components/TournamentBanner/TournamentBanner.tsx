import clsx from 'clsx';

import { TournamentLogo } from '~/components/TournamentLogo';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentTimer } from '~/components/TournamentTimer';
import { DeviceSize, useDeviceSize } from '~/hooks/useDeviceSize';
import { MAX_WIDTH } from '~/settings';
import { getTournamentDisplayName } from '~/utils/common/getTournamentDisplayName';

import styles from './TournamentBanner.module.scss';

export interface TournamentBannerProps {
  className?: string;
}

export const TournamentBanner = ({
  className,
}: TournamentBannerProps): JSX.Element => {
  const tournament = useTournament();
  const [deviceSize] = useDeviceSize();
  const showTimer = tournament.status === 'active' && tournament.currentRound !== undefined;
  const orientation = deviceSize < DeviceSize.Default ? 'vertical' : 'horizontal';
  return (
    <div
      className={clsx(styles.TournamentBanner, className)}
      style={tournament.bannerUrl ? {
        backgroundImage: `url(${tournament.bannerUrl}`,
        backgroundSize: 'cover',
      } : undefined}
    >
      <div
        className={styles.TournamentBanner_Content}
        style={{ maxWidth: MAX_WIDTH }}
        data-orientation={orientation}
      >
        <div className={styles.TournamentBanner_Title}>
          {tournament.logoUrl && (
            <TournamentLogo
              className={styles.TournamentBanner_Logo}
              url={tournament.logoUrl}
            // TODO: Add wrapper
            />
          )}
          <h1>{getTournamentDisplayName(tournament)}</h1>
        </div>
        {showTimer && (
          <div className={styles.TournamentBanner_Timer}>
            <TournamentTimer />
          </div>
        )}
      </div>
    </div>
  );
};
