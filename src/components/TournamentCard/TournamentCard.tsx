import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import clsx from 'clsx';
import { format } from 'date-fns';
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

import { FetchTournamentListItem } from '~/api';
import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/generic/Button';
import { Label } from '~/components/generic/Label';
import { MapboxLocation } from '~/components/generic/MapboxLocation';
import { ScrollArea } from '~/components/generic/ScrollArea';
import { Tag } from '~/components/generic/Tag';
import { ManageTournamentMenu } from '~/components/ManageTournamentMenu';
import { fowV4EraOptions } from '~/types/fowV4/fowV4EraSchema';
import { bem } from '~/utils/componentLib/bem';

import './TournamentCard.scss';

// TODO: Rename this component to TournamentOverview or something so it can logically be used
// In popups or drawers

export interface TournamentCardProps {
  tournament: FetchTournamentListItem;
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
  const user = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tournamentUrl = `/tournaments/${tournament._id}`;

  const handleClickView = (): void => {
    navigate(tournamentUrl);
  };

  const handleClickRegister = (): void => {
    navigate(`${tournamentUrl}/register`);
  };

  const isTournamentDetailPage = location.pathname.includes(tournamentUrl);

  const showExpanded = expanded !== undefined ? expanded : isTournamentDetailPage;
  const showActionButtons = !isTournamentDetailPage;

  const showManageRegistrationButton = false;
  const showManageTournamentButton = user?._id && tournament.organizerIds.includes(user._id);
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
              {format(tournament.startsAt, 'd MMM yyyy')} - {format(tournament.endsAt, 'd MMM yyyy')}
            </div>
            <div className={cn('Location')}>
              <MapPin />
              <MapboxLocation id={tournament?.location.placeId} />
            </div>
            <div className={cn('SeatsAvailable')}>
              <Users />
              <span>10 / 20</span>
              {tournament.competitorSize > 1 && (
                <span>- Team Size: {tournament.competitorSize}</span>
              )}
            </div>
            <div className={cn('GamePlay')}>
              <Dices />
              <Tag>{`${tournament.gameSystemConfig?.points} pts`}</Tag>
              <Tag>{fowV4EraOptions.find((option) => option.value === tournament.gameSystemConfig?.era)?.label}</Tag>
              {tournament.gameSystemConfig?.era === 'mw' && (
                <>
                  <Label>Dynamic Points</Label><span>{tournament.gameSystemConfig?.era}</span>
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
            {tournament.rulesPackUrl && (
              <div className={cn('RulesPack')}>
                <Link to={tournament.rulesPackUrl}>
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
            <Button onClick={handleClickRegister}>
              <UserPlus />
              Register
            </Button>
          )}
          {showManageRegistrationButton && (
            <Button>Manage Regs</Button>
          )}
          {/* {showManageTournamentButton && (
            <ManageTournamentMenu
              tournament={tournament}
              trigger={
                <Button>
                  <Cog />
                  Manage
                </Button>
              }
            />
          )} */}
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
