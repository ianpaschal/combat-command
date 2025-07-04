import { ReactNode } from 'react';

import { Tournament, TournamentCompetitor } from '~/api';
import { IdentityBadge } from '~/components/IdentityBadge';

export const sortCompetitorsByActive = (tournamentCompetitors: TournamentCompetitor[]) => (
  tournamentCompetitors.reduce(
    (acc, c) => {
      const key = c.active ? 'active' : 'inactive';
      acc[key].push(c);
      return acc;
    },
    { active: [] as TournamentCompetitor[], inactive: [] as TournamentCompetitor[] },
  )
);

export const getWarnings = (tournament: Tournament, tournamentCompetitors: TournamentCompetitor[]): ReactNode[] => {
  const round = (tournament.lastRound ?? -1) + 2;
  const { active, inactive } = sortCompetitorsByActive(tournamentCompetitors);
  const warnings: ReactNode[] = [];
  if (inactive.length > 0) {
    warnings.push(
      <>
        <p>
          {`The following ${tournament.useTeams ? ('team' + ((inactive.length ?? 0) > 1 ? 's are' : ' is')) : 'player(s)'} not listed as checked in and will not be included in the pairing process for round ${round}.`}
        </p>
        {inactive.map((tournamentCompetitor) => (
          <IdentityBadge key={tournamentCompetitor._id} size="small" competitor={tournamentCompetitor} />
        ))}
      </>,
    );
  }
  if (active.length % 2) {
    warnings.push(
      <p>
        {`There is an odd number of competitors, so one competitor will remain unpaired. As tournament organizer, you will need to submit match results for the ${tournament.useTeams ? 'team' : 'player'} with a bye, with the desired outcome.`}
      </p>,
    );
  }
  return warnings;
};
