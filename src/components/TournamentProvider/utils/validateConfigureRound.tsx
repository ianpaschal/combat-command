import { ReactNode } from 'react';

import { Tournament, TournamentCompetitor } from '~/api';
import { IdentityBadge } from '~/components/IdentityBadge';

export const validateConfigureRound = (
  tournament: Tournament,
  tournamentCompetitors: TournamentCompetitor[] = [],
): { errors: string[], warnings: ReactNode[] } => {
  const round = (tournament.lastRound ?? -1) + 2;
  const { active, inactive } = tournamentCompetitors.reduce((acc, c) => {
    const key = c.active ? 'active' : 'inactive';
    acc[key].push(c);
    return acc;
  }, { active: [] as TournamentCompetitor[], inactive: [] as TournamentCompetitor[] });

  const errors: string[] = [];
  const warnings: ReactNode[] = [];

  if (active.length < 2) {
    errors.push('Please ensure at least 2 competitors are active.');
  }
  if (active.length > tournament.maxCompetitors) {
    errors.push(`
      There are too many active competitors.
      Please disable ${active.length - tournament.maxCompetitors} to proceed.
    `);
  }
  for (const competitor of active) {
    const activePlayers = competitor.registrations.filter(({ active }) => active);
    if (activePlayers.length > tournament.competitorSize) {
      errors.push(`${competitor.displayName} has too many active players.`);
    }
    if (activePlayers.length < tournament.competitorSize) {
      errors.push(`${competitor.displayName} has too few active players.`);
    }
  }
  if (inactive.length > 0) {
    warnings.push(
      <>
        <p>
          {`
            The following ${tournament.useTeams ? ('team' + ((inactive.length ?? 0) > 1 ? 's are' : ' is')) : 'player(s)'}
            not listed as checked in and will not be included in the pairing process for round ${round}.
          `}
        </p>
        {inactive.map((tournamentCompetitor) => (
          <IdentityBadge
            key={tournamentCompetitor._id}
            size="small"
            competitor={tournamentCompetitor}
            disableLink
          />
        ))}
      </>,
    );
  }
  if (active.length % 2) {
    warnings.push(
      <p>
        {`
          There is an odd number of competitors, so one competitor will remain unpaired. As
          tournament organizer, you will need to submit match results for the
          ${tournament.useTeams ? 'team' : 'player'} with a bye, with the desired outcome.
        `}
      </p>,
    );
  }
  return { errors, warnings };
};
