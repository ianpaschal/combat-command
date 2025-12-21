import { generatePath, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronRight, Users } from 'lucide-react';

import { ContextMenu } from '~/components/ContextMenu';
import { Button } from '~/components/generic/Button';
import { Tag } from '~/components/generic/Tag';
import { TournamentCompetitorAvatar } from '~/components/IdentityBadge';
import { useTournamentCompetitor } from '~/components/TournamentCompetitorProvider/TournamentCompetitorProvider.hooks';
import { useTournament } from '~/components/TournamentProvider';
import { PATHS } from '~/settings';
import { getPathWithQuery } from '~/utils/common/getPathWithQuery';
import { getTournamentCompetitorDisplayName } from '~/utils/common/getTournamentCompetitorDisplayName';
import { getTournamentDisplayName } from '~/utils/common/getTournamentDisplayName';

import styles from './Header.module.scss';

export interface HeaderProps {
  className?: string;
}

export const Header = ({
  className,
}: HeaderProps): JSX.Element => {
  const navigate = useNavigate();
  const tournament = useTournament();
  const tournamentName = getTournamentDisplayName(tournament);

  const { tournamentCompetitor, actions } = useTournamentCompetitor();
  const tournamentCompetitorName = getTournamentCompetitorDisplayName(tournamentCompetitor);
  const tournamentCompetitorRank = tournamentCompetitor?.rank ?? -1;
  const handleViewAllRankings = (): void => {
    navigate(getPathWithQuery(generatePath(PATHS.tournamentDetails, {
      id: tournament._id,
    }), {
      tab: 'rankings',
    }));
  };
  return (
    <div className={clsx(styles.Header, className)}>
      <TournamentCompetitorAvatar
        className={styles.Header_Avatar}
        tournamentCompetitor={tournamentCompetitor}
      />
      {tournamentCompetitorRank > -1 && (
        <div className={styles.Header_Badge}>
          {tournamentCompetitorRank + 1}
        </div>
      )}
      <div className={styles.Header_Name}>
        <h1>{tournamentCompetitorName}</h1>
        <Tag>
          <Users />{`${tournamentCompetitor?.activeRegistrationCount ?? 0}/${tournament.competitorSize}`}
        </Tag>
      </div>
      <span className={styles.Header_Tournament}>
        {tournamentName}
      </span>
      <Button
        className={styles.Header_ViewAllRankingsButton}
        collapsePadding
        icon={<ChevronRight />}
        iconPosition="end"
        onClick={handleViewAllRankings}
        size="small"
        text="View All Rankings"
        variant="ghost"
      />
      <ContextMenu className={styles.Header_Actions} actions={actions} />
    </div>
  );
};
