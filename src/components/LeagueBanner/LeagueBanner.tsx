import clsx from 'clsx';

import { LeagueLogo } from '~/components/LeagueLogo';
import { useLeague } from '~/components/LeagueProvider';
import { DeviceSize, useDeviceSize } from '~/hooks/useDeviceSize';
import { MAX_WIDTH } from '~/settings';
import { getLeagueDisplayName } from '~/utils/common/getLeagueDisplayName';

import styles from './LeagueBanner.module.scss';

export interface LeagueBannerProps {
  className?: string;
}

export const LeagueBanner = ({
  className,
}: LeagueBannerProps): JSX.Element => {
  const league = useLeague();
  const [deviceSize] = useDeviceSize();
  const orientation = deviceSize < DeviceSize.Default ? 'vertical' : 'horizontal';
  return (
    <div
      className={clsx(styles.LeagueBanner, className)}
      style={league.bannerUrl ? {
        backgroundImage: `url(${league.bannerUrl})`,
        backgroundSize: 'cover',
      } : undefined}
    >
      <div
        className={styles.LeagueBanner_Content}
        style={{ maxWidth: MAX_WIDTH }}
        data-orientation={orientation}
      >
        <div className={styles.LeagueBanner_Title}>
          {league.logoUrl && (
            <LeagueLogo
              className={styles.LeagueBanner_Logo}
              url={league.logoUrl}
              wrapper={league.logoWrapper}
            />
          )}
          <h1>{getLeagueDisplayName(league)}</h1>
        </div>
      </div>
    </div>
  );
};
