import { useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useWindowWidth } from '@react-hook/window-size/throttled';
import { Swords } from 'lucide-react';

import { UserId } from '~/api';
import { Avatar } from '~/components/generic/Avatar';
import { Card } from '~/components/generic/Card';
import {
  Tabs,
  TabsContent,
  TabsList,
} from '~/components/generic/Tabs';
import { PageWrapper } from '~/components/PageWrapper';
import { DeviceSize, useDeviceSize } from '~/hooks/useDeviceSize';
import { UserMatchResultsCard } from '~/pages/UserProfilePage/components/UserMatchResultsCard';
import { useGetUser } from '~/services/users';
import { MIN_WIDTH_DESKTOP, MIN_WIDTH_TABLET } from '~/settings';
import { getUserDisplayNameString } from '~/utils/common/getUserDisplayNameString';

import styles from './UserProfilePage.module.scss';

export const UserProfilePage = (): JSX.Element => {
  const [deviceSize] = useDeviceSize();
  const params = useParams();
  const userId = params.id! as UserId; // Must exist or else how did we get to this route?

  const windowWidth = useWindowWidth();

  const getLayout = () => {
    if (windowWidth >= MIN_WIDTH_DESKTOP) {
      return 'extra-wide';
    }
    if (windowWidth >= MIN_WIDTH_TABLET) {
      return 'wide';
    }
    return 'narrow';
  };

  const layout = getLayout();

  const { data: user } = useGetUser({ id: userId });

  const [searchParams, setSearchParams] = useSearchParams();
  const queryTab = searchParams.get('tab');

  const handleTabChange = useCallback((tab: string) => {
    setSearchParams({ tab }, { replace: true });
  }, [setSearchParams]);

  const isDesktop = deviceSize >= DeviceSize.Wide;
  const tabs = [
    { value: 'matchResults', label: 'Match Results', icon: <Swords /> },
    // { value: 'tournaments', label: 'Tournaments', icon: <Trophy /> },
  ];
  const activeTab = !queryTab || tabs.findIndex((tab) => tab.value === queryTab) === -1 ? 'matchResults' : queryTab;
  const showTabLabels = deviceSize >= DeviceSize.Default;

  // const awards = [];

  return (
    <PageWrapper showBackButton fitToWindow={isDesktop}>
      <div className={styles.UserProfilePage} data-layout={layout}>
        <Card className={styles.UserProfilePage_ProfileCard}>
          <div className={styles.UserProfilePage_ProfileCard_Identity}>
            <Avatar className={styles.UserProfilePage_ProfileCard_Avatar} url={user?.avatarUrl} />
            <div>
              <h1>{getUserDisplayNameString(user)}</h1>
              <p>{user?.username}</p>
            </div>
          </div>
          {/* {(awards ?? []).length > 0 && (
            <div className={styles.UserProfilePage_ProfileCard_Awards}>
              <h1>{getUserDisplayNameString(user)}</h1>
              <p>{user?.username}</p>
            </div>
          )} */}
        </Card>
        <Tabs className={styles.UserProfilePage_Tabs} value={activeTab} onValueChange={handleTabChange}>
          {tabs.length > 1 && (
            <TabsList hideLabels={!showTabLabels} tabs={tabs} />
          )}
          <TabsContent value="matchResults" className={styles.UserProfilePage_TabContent}>
            <UserMatchResultsCard className={styles.UserProfilePage_MatchResults} userId={userId} />
          </TabsContent>
          {/* <TabsContent value="tournaments" className={styles.UserProfilePage_TabContent}>
            <UserTournamentsCard className={styles.UserProfilePage_Tournaments} userId={userId} />
          </TabsContent>
          <TabsContent value="stats" className={styles.UserProfilePage_TabContent}>
            stats card goes here
          </TabsContent> */}
        </Tabs>
      </div>
    </PageWrapper>
  );
};
