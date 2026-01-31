import { generatePath, NavigateFunction } from 'react-router-dom';
import { ColumnDef } from '@ianpaschal/combat-command-components';
import { ChevronRight } from 'lucide-react';

import { Tournament, TournamentCompetitor } from '~/api';
import { FactionIndicator } from '~/components/FactionIndicator';
import { Button } from '~/components/generic/Button';
import { TournamentCompetitorIdentity } from '~/components/TournamentCompetitorIdentity';
import { TournamentCompetitorActiveToggle, TournamentCompetitorPlayerCount } from '~/components/TournamentCompetitorProvider';
import { PATHS } from '~/settings';

export const getTournamentCompetitorTableConfig = (
  navigate: NavigateFunction,
  tournament: Tournament,
): ColumnDef<TournamentCompetitor>[] => ([
  {
    key: 'identity',
    label: tournament.useTeams ? 'Team' : 'Player',
    xAlign: 'left',
    renderCell: (r) => (
      <TournamentCompetitorIdentity tournamentCompetitor={r} />
    ),
  },
  ...(tournament.alignmentsVisible ? [{
    key: 'alignments',
    xAlign: 'center',
    renderCell: (r) => (
      <FactionIndicator {...r.details} />
    ),
  } as ColumnDef<TournamentCompetitor>] : []),
  { key: 'spacer', width: '1fr' },
  ...(tournament.useTeams ? [{
    key: 'players',
    label: 'Players',
    xAlign: 'left',
    renderCell: (r) => (
      <TournamentCompetitorPlayerCount tournamentCompetitor={r} />
    ),
  } as ColumnDef<TournamentCompetitor>] : []),
  ...(tournament.status === 'active' ? [{
    key: 'active',
    label: 'Ready',
    xAlign: 'center',
    renderCell: (r) => (
      <TournamentCompetitorActiveToggle tournamentCompetitor={r} />
    ),
  } as ColumnDef<TournamentCompetitor>] : []),
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
