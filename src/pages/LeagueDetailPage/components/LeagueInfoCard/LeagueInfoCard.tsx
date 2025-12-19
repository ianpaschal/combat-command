import clsx from 'clsx';

import { useLeague } from '~/components/LeagueProvider';
import { LeagueDetailCard } from '../LeagueDetailCard';

import styles from './LeagueInfoCard.module.scss';

export interface LeagueInfoCardProps {
  className?: string;
}

export const LeagueInfoCard = ({
  className,
}: LeagueInfoCardProps): JSX.Element => {
  const league = useLeague();
  return (
    <LeagueDetailCard
      className={clsx(className)}
      title="Info"
      buttons={[]}
    >
      <div className={styles.LeagueInfoCard_InfoBlock}>
        <p>{league.description}</p>
      </div>
    </LeagueDetailCard>
  );
};
