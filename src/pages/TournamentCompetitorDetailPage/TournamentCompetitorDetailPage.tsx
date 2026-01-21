import {
  generatePath,
  Navigate,
  useParams,
} from 'react-router-dom';
import clsx from 'clsx';
import {
  Construction,
  LineChart,
  Swords,
  Users,
} from 'lucide-react';
import { useQueryState } from 'nuqs';

import { TournamentCompetitorId, TournamentId } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { EmptyState } from '~/components/EmptyState';
import { Spinner } from '~/components/generic/Spinner';
import {
  Tabs,
  TabsContent,
  TabsList,
} from '~/components/generic/Tabs';
import { NotFoundView } from '~/components/NotFoundView';
import { PageWrapper } from '~/components/PageWrapper';
import { TournamentCompetitorProvider } from '~/components/TournamentCompetitorProvider';
import { TournamentProvider } from '~/components/TournamentProvider';
import { DeviceSize, useDeviceSize } from '~/hooks/useDeviceSize';
import { TournamentRegistrationsTable } from '~/pages/TournamentCompetitorDetailPage/components/TournamentRegistrationsTable';
import { useGetTournamentCompetitor } from '~/services/tournamentCompetitors';
import { useGetTournament } from '~/services/tournaments';
import { PATHS } from '~/settings';
import { getLastVisibleTournamentRound } from '~/utils/common/getLastVisibleTournamentRound';
import { Header } from './components/Header';

import styles from './TournamentCompetitorDetailPage.module.scss';

export interface TournamentCompetitorDetailPageProps {
  className?: string;
}

export const TournamentCompetitorDetailPage = ({
  className,
}: TournamentCompetitorDetailPageProps): JSX.Element => {
  const user = useAuth();
  const params = useParams();
  const tournamentId = params.tournamentId! as TournamentId; // Must exist or else how did we get to this route?
  const tournamentCompetitorId = params.tournamentCompetitorId! as TournamentCompetitorId; // Must exist or else how did we get to this route?
  const {
    data: tournament,
    loading: isTournamentLoading,
  } = useGetTournament({ id: tournamentId });
  const {
    data: tournamentCompetitor,
    loading: isTournamentCompetitorLoading,
  } = useGetTournamentCompetitor({
    id: tournamentCompetitorId,
    includeRankings: tournament ? getLastVisibleTournamentRound(tournament, user) : undefined,
  });
  const loading = isTournamentLoading || isTournamentCompetitorLoading;

  const tabs = [
    { value: 'roster', label: 'Roster', icon: <Users /> },
    { value: 'matchResults', label: 'Match Results', icon: <Swords /> },
    { value: 'stats', label: 'Stats', icon: <LineChart /> },
  ];
  const [tab, setTab] = useQueryState('tab', { defaultValue: 'roster' });
  const [deviceSize] = useDeviceSize();
  const showTabLabels = deviceSize >= DeviceSize.Default;

  if (loading) {
    return (
      <div className={styles.TournamentCompetitorPage_LoadingState}>
        <Spinner />
      </div>
    );
  }

  if (!tournament) {
    return <NotFoundView />;
  }

  if (!tournamentCompetitor) {
    return <Navigate to={generatePath(PATHS.tournamentDetails, { id: tournamentId })} replace />;
  }

  // const showJoinButton = tournamentCompetitor.availableActions.includes(TournamentCompetitorActionKey.Join);

  return (
    <TournamentProvider tournament={tournament}>
      <TournamentCompetitorProvider tournamentCompetitor={tournamentCompetitor}>
        <PageWrapper maxWidth={640} showBackButton fitToWindow>
          <div className={clsx(styles.TournamentCompetitorPage, className)}>
            <Header className={styles.TournamentCompetitorPage_Header} />
            <Tabs value={tab} onValueChange={setTab} className={styles.TournamentCompetitorPage_Tabs}>
              <TabsList hideLabels={!showTabLabels} tabs={tabs} className={styles.TournamentCompetitorPage_TabsList} stretch />
              <TabsContent value="roster" className={styles.TournamentCompetitorPage_TabsContent}>
                {/* <div className={styles.TournamentCompetitorPage_Warnings}>
                  warnings
                </div> */}
                <TournamentRegistrationsTable
                  className={styles.TournamentCompetitorPage_Table}
                  registrations={tournamentCompetitor?.registrations ?? []}
                />
                {/* {showJoinButton && (
                  <div className={styles.TournamentCompetitorPage_Actions}>
                    <Button text="Join" icon={<UserPlus />} />
                  </div>
                )} */}
              </TabsContent>
              <TabsContent value="matchResults">
                <EmptyState icon={<Construction />} message="Under Construction" />
              </TabsContent>
              <TabsContent value="stats">
                <EmptyState icon={<Construction />} message="Under Construction" />
              </TabsContent>
            </Tabs>
          </div>
        </PageWrapper>
      </TournamentCompetitorProvider>
    </TournamentProvider>
  );
};
