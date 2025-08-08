import { generatePath, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { Tournament } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { TournamentActionsProvider } from '~/components/TournamentActionsProvider';
import { TournamentContextMenu } from '~/components/TournamentContextMenu';
import { TournamentInfoBlock } from '~/components/TournamentInfoBlock/';
import { TournamentLogo } from '~/components/TournamentLogo';
import { TournamentProvider } from '~/components/TournamentProvider';
import { useElementSize } from '~/hooks/useElementSize';
import { MIN_WIDTH_TABLET, PATHS } from '~/settings';
import { getTournamentDisplayName } from '~/utils/common/getTournamentDisplayName';

import styles from './TournamentCard.module.scss';

export interface TournamentCardProps {
  tournament: Tournament;
}

export const TournamentCard = ({
  tournament,
}: TournamentCardProps): JSX.Element => {
  const user = useAuth();
  const navigate = useNavigate();
  const [ref, width] = useElementSize();
  const detailsPath = generatePath(PATHS.tournamentDetails, { id: tournament._id });
  const handleClickDetails = (): void => {
    navigate(detailsPath);
  };

  const getLayout = () => {
    if (width > 802) {
      return 'extra-wide';
    }
    if (width > MIN_WIDTH_TABLET - 32) {
      return 'wide';
    }
    return 'narrow';
  };

  const layout = getLayout();

  const showContextMenu = user && tournament.organizerUserIds.includes(user._id);

  return (
    <TournamentProvider tournament={tournament}>
      <TournamentActionsProvider>
        <div className={styles.TournamentCard} data-layout={layout} ref={ref}>
          <div className={styles.TournamentCard_Banner} style={tournament.bannerUrl ? {
            backgroundImage: `url(${tournament.bannerUrl}`,
            backgroundSize: 'cover',
          } : undefined}>
            {tournament?.logoUrl && (
              <TournamentLogo
                className={styles.TournamentCard_Logo}
                url={tournament.logoUrl}
              />
            )}
          </div>
          <div className={styles.TournamentCard_Title}>
            <h2>{getTournamentDisplayName(tournament)}</h2>
            <div className={styles.TournamentCard_Buttons}>
              {showContextMenu && (
                <TournamentContextMenu />
              )}
              <Button onClick={handleClickDetails}>
                {layout !== 'narrow' && (
                  'View'
                )}
                <ChevronRight />
              </Button>
            </div>
          </div>
          <TournamentInfoBlock type="practical" className={styles.InfoBlock} />
          <TournamentInfoBlock type="gameSystem" className={styles.InfoBlock} />
        </div>
      </TournamentActionsProvider>
    </TournamentProvider>
  );
};
