import { generatePath, NavigateFunction } from 'react-router-dom';
import { ColumnDef } from '@ianpaschal/combat-command-components';
import { ChevronRight } from 'lucide-react';

import { Tournament, TournamentCompetitor } from '~/api';
import { Button } from '~/components/generic/Button';
import { IdentityBadge } from '~/components/IdentityBadge';
import { TournamentCompetitorActiveToggle, TournamentCompetitorPlayerCount } from '~/components/TournamentCompetitorProvider';
import { PATHS } from '~/settings';

export const getTournamentCompetitorTableConfig = (
  navigate: NavigateFunction,
  tournament: Tournament,
): ColumnDef<TournamentCompetitor>[] => ([
  {
    key: 'identity',
    label: tournament.useTeams ? 'Team' : 'Player',
    width: '1fr',
    xAlign: 'left',
    renderCell: (r) => (
      <IdentityBadge competitor={r} />
    ),
  },
  ...(tournament.useTeams ? [
    {
      key: 'players',
      label: 'Players',
      xAlign: 'left',
      renderCell: (r) => (
        <TournamentCompetitorPlayerCount tournamentCompetitor={r} />
      ),
    } as ColumnDef<TournamentCompetitor>,
  ] : []),
  ...(tournament.status === 'active' ? [
    {
      key: 'active',
      label: 'Ready',
      xAlign: 'center',
      renderCell: (r) => (
        <TournamentCompetitorActiveToggle tournamentCompetitor={r} />
      ),
    } as ColumnDef<TournamentCompetitor>,
  ] : []),
  {
    key: 'viewDetails',
    xAlign: 'center',
    renderCell: ({ _id: tournamentCompetitorId, tournamentId }) => (
      <Button
        icon={<ChevronRight />}
        variant="secondary"
        onClick={() => navigate(generatePath(PATHS.tournamentCompetitorDetails, {
          tournamentId,
          tournamentCompetitorId,
        }))}
      />
    ),
    renderHeader: () => null,
  },
]);
