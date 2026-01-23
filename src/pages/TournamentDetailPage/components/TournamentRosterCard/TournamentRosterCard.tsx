import { ReactElement } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { Button, Table } from '@ianpaschal/combat-command-components';
import clsx from 'clsx';
import {
  EyeOff,
  Link,
  Users,
} from 'lucide-react';

import { TournamentActionKey } from '~/api';
import { AlignmentGraph } from '~/components/AlignmentGraph';
import { useAuth } from '~/components/AuthProvider';
import { EmptyState } from '~/components/EmptyState';
import { Tag } from '~/components/generic/Tag';
import { toast } from '~/components/ToastProvider';
import { useActions, useTournament } from '~/components/TournamentProvider';
import { useGetTournamentCompetitorsByTournament } from '~/services/tournamentCompetitors';
import { usePublishTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';
import { TournamentDetailCard } from '../TournamentDetailCard';
import { getTournamentCompetitorTableConfig } from './TournamentRosterCard.utils';

import styles from './TournamentRosterCard.module.scss';

export interface TournamentRosterCardProps {
  className?: string;
}

export const TournamentRosterCard = ({
  className,
}: TournamentRosterCardProps): JSX.Element => {
  const navigate = useNavigate();
  const user = useAuth();
  const tournament = useTournament();
  const actions = useActions(tournament);

  const { data: tournamentCompetitors, loading } = useGetTournamentCompetitorsByTournament({ tournamentId: tournament._id });

  const { mutation: publishTournament } = usePublishTournament({
    successMessage: `${tournament.title} is now live!`,
  });
  const columns = getTournamentCompetitorTableConfig(navigate, tournament);
  const rows = (tournamentCompetitors || []);

  const showLoadingState = loading;
  const showEmptyState = !loading && !tournamentCompetitors?.length;

  const isOrganizer = isUserTournamentOrganizer(user, tournament);

  const getControls = (): ReactElement[] => [
    TournamentActionKey.AddPlayer,
    TournamentActionKey.Join,
    TournamentActionKey.Leave,
  ].reduce((acc, key) => actions[key] ? [...acc, (
    <Button
      key={key}
      text={actions[key].label}
      onClick={actions[key].handler}
      icon={actions[key].icon}
    />
  )] : acc, [] as ReactElement[]);

  const handlePublish = (): void => {
    publishTournament({ id: tournament._id });
  };

  const handleCopyLink = async (): Promise<void> => {
    try {
      const detailsPath = generatePath(PATHS.tournamentDetails, { id: tournament._id });
      await navigator.clipboard.writeText(`${window.location.origin}${detailsPath}?tab=roster`);
      toast.info('Copied to clipboard!');
    } catch (error) {
      console.error(error);
    }
  };

  const emptyStateProps = tournament.status === 'draft' && isOrganizer ? {
    icon: <EyeOff />,
    message: 'Your tournament is not yet visible.',
    children: <Button text="Publish" onClick={handlePublish} />,
  } : {
    icon: <Users />,
    message: 'No competitors registered yet.',
    children: <Button icon={<Link />} text="Copy Link" onClick={handleCopyLink} />,
  };

  return (
    <TournamentDetailCard
      className={clsx(className)}
      title={(
        <>
          <span>Roster</span>
          <Tag>
            <Users />{`${tournament.playerCount}/${tournament.maxPlayers}`}
          </Tag>
        </>
      )}
      buttons={getControls()}
    >
      {
        showLoadingState ? (
          <div className={styles.TournamentRosterCard_EmptyState} >
            Loading...
          </div>
        ) : (
          showEmptyState ? (
            <EmptyState {...emptyStateProps} />
          ) : (
            <>
              {(tournament.alignmentsVisible || tournament.factionsVisible) && (
                <div className={styles.TournamentRosterCard_Graphs}>
                  {tournament.alignmentsVisible && (
                    <AlignmentGraph />
                  )}
                </div>
              )}
              <Table className={styles.TournamentRosterCard_Table} columns={columns} rows={rows} />
            </>
          )
        )}
    </TournamentDetailCard >
  );
};
