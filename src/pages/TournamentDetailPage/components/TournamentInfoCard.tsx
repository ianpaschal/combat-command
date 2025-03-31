import { generatePath, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Pencil } from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Separator } from '~/components/generic/Separator';
import { TournamentInfoBlock } from '~/components/TournamentInfoBlock';
import { useTournament } from '~/components/TournamentProvider';
import { TournamentDetailsCard } from '~/pages/TournamentDetailPage/components/TournamentDetailsCard';
import { PATHS } from '~/settings';

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
  const showManageButton = user && tournament.organizerUserIds.includes(user._id);
  return (
    <TournamentDetailsCard className={clsx(className)} title="Info" buttons={showManageButton ? [
      <Button key={0} onClick={handleClickManage} muted>
        <Pencil />Edit
      </Button>,
    ] : undefined}>
      <ScrollArea>
        <p className={styles.TournamentInfoCard_InfoBlock}>{tournament.description}</p>
        <Separator />
        <TournamentInfoBlock type="practical" className={styles.TournamentInfoCard_InfoBlock} />
        <Separator />
        <TournamentInfoBlock type="gameSystem" className={styles.TournamentInfoCard_InfoBlock} />
      </ScrollArea >
    </TournamentDetailsCard>
  );
};
