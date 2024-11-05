import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import clsx from 'clsx';
import {
  ArrowRight,
  CalendarClock,
  Cog,
  Dices,
  MapPin,
  SquareArrowOutUpRight,
  UserPlus,
  Users,
} from 'lucide-react';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Tag } from '~/components/generic/Tag';
import { ManageTournamentMenu } from '~/components/ManageTournamentMenu';
import { FetchTournamentsItem } from '~/services/tournaments/fetchTournamentsList';
import { fowV4EraOptions } from '~/types/fowV4/fowV4EraSchema';
import { bem } from '~/utils/componentLib/bem';

import './TournamentCard.scss';

// TODO: Rename this component to TournamentOverview or something so it can logically be used
// In popups or drawers

export interface TournamentCardProps {
  tournament: FetchTournamentsItem;
  maxHeight?: number | string;
  className?: string;
  expanded?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const cn = bem('TournamentCard');

export const TournamentCard = ({
  tournament,
  className,
  expanded,
  orientation = 'vertical',
}: TournamentCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tournamentUrl = `/tournaments/${tournament.id}`;

  const handleClickView = (): void => {
    navigate(tournamentUrl);
  };

  const isTournamentDetailPage = location.pathname.includes(tournamentUrl);

  const showExpanded = expanded !== undefined ? expanded : isTournamentDetailPage;
  const showActionButtons = !isTournamentDetailPage;

  const showManageRegistrationButton = false;
  const showManageTournamentButton = tournament.creator_id === user?.id;
  const showRegisterButton = user && !showManageTournamentButton && !showManageRegistrationButton;

  return (
    <div className={clsx(cn(), `${cn()}-${orientation}`, className)}>
      <div className={cn('Banner')}>
        <div className={cn('BannerOverlay')} />
      </div>
      <ScrollArea indicatorBorder={showActionButtons ? ['bottom'] : undefined}>
        <div className={cn('InfoSection')}>
          <h3 className={cn('GameSystem')}>Flames of War V4</h3>
          <h2 className={cn('Title')}>{tournament.title}</h2>
          <div className={cn('Overview')}>
            <div className={cn('DateTime')}>
              <CalendarClock />
              {tournament.starts_at} - {tournament.ends_at}
            </div>
            <div className={cn('Location')}>
              <MapPin />
              {tournament.location}
            </div>
            <div className={cn('SeatsAvailable')}>
              <Users />
              <span>10 / 20</span>
              {tournament.competitor_size > 1 && (
                <span>- Team Size: {tournament.competitor_size}</span>
              )}
            </div>
            <div className={cn('GamePlay')}>
              <Dices />
              <Tag>{`${tournament.game_system_config?.data?.points} pts`}</Tag>
              <Tag>{fowV4EraOptions.find((option) => option.value === tournament.game_system_config?.data?.era)?.label}</Tag>
              {tournament.game_system_config?.data?.era === 'mw' && (
                <>
                  <Label>Dynamic Points</Label><span>{tournament.game_system_config?.data?.era}</span>
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
      </ScrollArea>
      {showActionButtons && (
        <div className={cn('Actions')}>
          {showRegisterButton && (
            <Button>
              <UserPlus />
              Register
            </Button>
          )}
          {showManageRegistrationButton && (
            <Button>Manage Regs</Button>
          )}
          {showManageTournamentButton && (
            <ManageTournamentMenu
              tournament={tournament}
              trigger={
                <Button>
                  <Cog />
                  Manage
                </Button>
              }
            />
          )}
          {!isTournamentDetailPage && (
            <Button onClick={handleClickView}>
              View
              <ArrowRight />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};