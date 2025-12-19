import { generatePath, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import qs from 'qs';

import { League } from '~/api';
import { Button } from '~/components/generic/Button';
import { Tag } from '~/components/generic/Tag';
import { IdentityBadge } from '~/components/IdentityBadge';
import { LeagueLogo } from '~/components/LeagueLogo';
import { LeagueProvider } from '~/components/LeagueProvider';
import { PATHS } from '~/settings';
import { getLeagueDisplayName } from '~/utils/common/getLeagueDisplayName';

import styles from './LeagueCard.module.scss';

export interface LeagueCardProps {
  league: League;
}

export const LeagueCard = ({
  league,
}: LeagueCardProps): JSX.Element => {
  const navigate = useNavigate();
  const detailsPath = generatePath(PATHS.leagueDetails, { id: league._id });
  const handleClickBanner = (): void => {
    navigate(`${detailsPath}?${qs.stringify({ tab: 'info' })}`);
  };
  const handleClickRankings = (): void => {
    navigate(`${detailsPath}?${qs.stringify({ tab: 'rankings' })}`);
  };
  return (
    <LeagueProvider league={league}>
      <div className={styles.LeagueCard}>
        <div className={styles.LeagueCard_Content}>
          <div className={styles.LeagueCard_Banner} style={league.bannerUrl ? {
            backgroundImage: `url(${league.bannerUrl}`,
            backgroundSize: 'cover',
          } : undefined} onClick={handleClickBanner}>
            {league?.logoUrl && (
              <LeagueLogo
                className={styles.LeagueCard_Logo}
                url={league.logoUrl}
                wrapper={league.logoWrapper}
              />
            )}
            <div className={styles.LeagueCard_Title}>
              <h1>{getLeagueDisplayName(league)}</h1>
              {league.status === 'draft' && (
                <Tag>Draft</Tag>
              )}
            </div>
          </div>
          <div className={styles.LeagueCard_Rankings}>
            <div className={styles.LeagueCard_RankingsList}>
              {(league.rankings ?? []).slice(0, 3).map((ranking) => (
                <div key={ranking.userId} className={styles.LeagueCard_RankingItem}>
                  <span>
                    {ranking.rank + 1}
                  </span>
                  <IdentityBadge user={ranking?.user} />
                </div>
              ))}
            </div>
            <div className={styles.LeagueCard_RankingsFooter}>
              <Button
                text="View Full Rankings"
                iconPosition="end"
                icon={<ChevronRight />}
                onClick={handleClickRankings}
              />
            </div>
          </div>
        </div>
      </div>
    </LeagueProvider>
  );
};
