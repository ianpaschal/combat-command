import { generatePath, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { Tournament } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { TournamentContextMenu } from '~/components/TournamentContextMenu';
import { TournamentInfoBlock } from '~/components/TournamentInfoBlock/';
import { TournamentProvider } from '~/components/TournamentProvider';
import { useElementSize } from '~/hooks/useElementSize';
import { MIN_WIDTH_TABLET, PATHS } from '~/settings';

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
      <div className={styles.TournamentCard} data-layout={layout} ref={ref}>
        <div className={styles.TournamentCard_Banner} style={tournament.bannerUrl ? {
          backgroundImage: `url(${tournament.bannerUrl}`,
          backgroundSize: 'cover',
        } : undefined}>
          {tournament?.logoUrl && (
            <img src={tournament.logoUrl} alt={tournament.title} />
          )}
        </div>
        <div className={styles.TournamentCard_Title}>
          <h2>{tournament.title}</h2>
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
    </TournamentProvider>
  );
};
