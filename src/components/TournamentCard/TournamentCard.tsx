import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpFromDot,
  CalendarClock,
  Cog,
  Dices,
  Map,
  MapPin,
  MoreHorizontal,
  MoreVertical,
  SquareArrowOutUpRight,
  UserPlus,
  Users,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Card } from '~/components/generic/Card';
import { Label } from '~/components/generic/Label';
import { Stack } from '~/components/generic/Stack';
import { Tag } from '~/components/generic/Tag';
import { fowV4EraOptions } from '~/types/fowV4/fowV4EraSchema';
import { TournamentRecord } from '~/types/Tournament';
import { bem } from '~/utils/componentLib/bem';

import './TournamentCard.scss';

export interface TournamentCardProps {
  tournament: TournamentRecord;
  maxHeight?: number | string;
  expanded?: boolean;
}

const cn = bem('TournamentCard');

export const TournamentCard = ({
  tournament,
  expanded,
}: TournamentCardProps) => {
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tournamentUrl = `/tournaments/${tournament.id}`;

  const handleClickView = (): void => {
    navigate(tournamentUrl);
  };

  const isTournamentDetailPage = location.pathname.includes(tournamentUrl);

  const showExpanded = expanded !== undefined ? expanded : isTournamentDetailPage;

  const showManageRegistrationButton = false;
  const showManageTournamentButton = user && tournament.organizer_ids.includes(user.id);
  const showRegisterButton = user && !showManageTournamentButton && !showManageRegistrationButton;

  return (
    <Card className={cn()} disablePadding>
      <div className={cn('Banner')}>
        <div className={cn('BannerOverlay')} />
      </div>
      <div className={cn('InfoSection')}>
        <h3 className={cn('GameSystem')}>Flames of War V4</h3>
        <h2 className={cn('Title')}>{tournament.title}</h2>
        <div className={cn('Overview')}>
          <div className={cn('DateTime')}>
            <CalendarClock />
            {tournament.start_date} - {tournament.end_date}
          </div>
          <div className={cn('Location')}>
            <MapPin />
            {tournament.location}
          </div>
          <div className={cn('SeatsAvailable')}>
            <Users />
            10 / 20
          </div>
          <div className={cn('GamePlay')}>
            <Dices />
            <Tag>{`${tournament.game_system_config.points} pts`}</Tag>
            <Tag>{fowV4EraOptions.find((option) => option.value === tournament.game_system_config.era)?.label}</Tag>
            {tournament.game_system_config.era === 'mw' && (
              <>
                <Label>Dynamic Points</Label><span>{tournament.game_system_config.era}</span>
              </>
            )}
          </div>
        </div>
      </div>
      {showExpanded && (
        <div className={cn('InfoSectionExpanded')}>
          <div className={cn('Description')}>
            <h3>Description</h3>
            <p>{tournament.description}</p>
          </div>
          {tournament.rules_pack_url && (
            <div className={cn('RulesPack')}>
              <Link to={tournament.rules_pack_url}>
                Rules Pack<SquareArrowOutUpRight />
              </Link>
            </div>
          )}
          <div className={cn('PairingRanking')}>
            <h3>Pairing & Ranking</h3>
            <p>{tournament.description}</p>
          </div>
        </div>
      )}
      <div className={cn('Actions')}>
        {showRegisterButton && (
          <Button>
            <UserPlus />
            Register
          </Button>
        )}
        {showManageRegistrationButton && (
          <Button>Manage</Button>
        )}
        {showManageTournamentButton && (
          <Button>
            <Cog />
            Manage
          </Button>
        )}
        {!isTournamentDetailPage && (
          <Button onClick={handleClickView}>
            View
            <ArrowRight />
          </Button>
        )}
      </div>
    </Card>
  );
};