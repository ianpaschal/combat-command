import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronRight, Plus } from 'lucide-react';

import { Tournament } from '~/api';
import { Button } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { TournamentCard } from '~/components/TournamentCard';
import { PATHS } from '~/settings';
import { Header } from '../Header';

import styles from './TournamentsList.module.scss';

export interface TournamentsListProps {
  className?: string;
  tournaments?: Tournament[];
  limit?: number;
}

export const TournamentsList = ({
  className,
  tournaments = [],
  limit = 5,
}: TournamentsListProps): JSX.Element => {
  const navigate = useNavigate();
  const handleViewMore = (): void => {
    navigate(PATHS.tournaments);
  };
  const handleCreate = (): void => {
    navigate(PATHS.tournamentCreate);
  };
  return (
    <>
      <Header title="Upcoming Tournaments">
        <Button icon={<ChevronRight />} variant="secondary" onClick={handleViewMore} />
      </Header>
      {tournaments.length ? (
        <ScrollArea className={clsx(styles.TournamentsList_ScrollArea, className)}>
          <div className={styles.TournamentsList_List}>
            {tournaments.slice(0, limit).map((tournament) => (
              <TournamentCard key={tournament._id} tournament={tournament} />
            ))}
            {tournaments.length > limit && (
              <div className={styles.TournamentsList_List_ViewAllButton} onClick={handleViewMore}>
                <Button icon={<ChevronRight />} iconPosition="end" text="View All" />
              </div>
            )}
          </div>
        </ScrollArea>
      ) : (
        <div className={clsx(styles.TournamentsList_EmptyState, className)}>
          <Button icon={<Plus />} text="Create" onClick={handleCreate} />
        </div>
      )}
    </>
  );
};
