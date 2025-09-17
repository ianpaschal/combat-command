import { ReactElement } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Pencil } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Separator } from '~/components/generic/Separator';
import { TournamentInfoBlock } from '~/components/TournamentInfoBlock';
import { useTournament } from '~/components/TournamentProvider';
import { PATHS } from '~/settings';
import { isUserTournamentOrganizer } from '~/utils/common/isUserTournamentOrganizer';
import { TournamentDetailCard } from '../TournamentDetailCard';

import styles from './TournamentInfoCard.module.scss';

export interface TournamentInfoCardProps {
  className?: string;
}

export const TournamentInfoCard = ({
  className,
}: TournamentInfoCardProps): JSX.Element => {
  const user = useAuth();
  const tournament = useTournament();
  const navigate = useNavigate();
  const handleClickManage = () => {
    navigate(generatePath(PATHS.tournamentEdit, { id: tournament._id }));
  };

  const getPrimaryButtons = (): ReactElement[] | undefined => {
    if (isUserTournamentOrganizer(user, tournament)) {
      return [
        <Button icon={<Pencil />}
          text="Edit"
          variant="secondary"
          onClick={handleClickManage}
        />,
      ];
    }
  };
  return (
    <TournamentDetailCard
      className={clsx(className)}
      title="Info"
      buttons={getPrimaryButtons()}
    >
      <p className={styles.TournamentInfoCard_InfoBlock}>{tournament.description}</p>
      <Separator />
      <TournamentInfoBlock type="practical" className={styles.TournamentInfoCard_InfoBlock} />
      <Separator />
      <TournamentInfoBlock type="gameSystem" className={styles.TournamentInfoCard_InfoBlock} />
    </TournamentDetailCard>
  );
};
