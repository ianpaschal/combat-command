import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { Stack } from '~/components/generic/Stack';
import { TournamentRecord } from '~/types/Tournament';
import { bem } from '~/utils/componentLib/bem';

import './TournamentCard.scss';

export interface TournamentCardProps {
  tournament: TournamentRecord;
  maxHeight?: number | string;
}

const cn = bem('TournamentCard');

export const TournamentCard = ({
  tournament,
}: TournamentCardProps) => {
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tournamentUrl = `/tournaments/${tournament.id}`;

  const handleClickView = (): void => {
    navigate(tournamentUrl);
  };

  const showViewButton = !location.pathname.includes(tournamentUrl);

  const showManageRegistrationButton = false;
  const showManageTournamentButton = user && tournament.organizer_ids.includes(user.id);
  const showRegisterButton = user && !showManageTournamentButton && !showManageRegistrationButton;

  return (
    <Card className={cn()} disablePadding>
      <div className={cn('Banner')}>
        <div className={cn('BannerOverlay')} />
      </div>
      <Stack className={cn('Description')}>
        <div>
          Date
          Place
          Game System & Rules
        </div>
        <h3>Description</h3>
        <p>{tournament.description}</p>
        <h3>Rankings & Pairings</h3>
        <p>{tournament.description}</p>
      </Stack>
      <div className={cn('Actions')}>
        {showRegisterButton && (
          <Button>Register</Button>
        )}
        {showManageRegistrationButton && (
          <Button>Manage</Button>
        )}
        {showManageTournamentButton && (
          <Button>Manage</Button>
        )}
        {showViewButton && (
          <Button onClick={handleClickView}>View</Button>
        )}
      </div>
    </Card>
  );
};