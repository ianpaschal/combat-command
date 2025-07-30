import { ChevronRight } from 'lucide-react';

import { TournamentPairing } from '~/api';
import { IdentityBadgeProps } from '~/components/IdentityBadge';

export const getIdentityBadgeProps = (
  pairing?: Pick<TournamentPairing, 'tournamentCompetitor0' | 'tournamentCompetitor1' | 'table'>,
): [Partial<IdentityBadgeProps>, Partial<IdentityBadgeProps>] => {
  if (!pairing) {
    return [{}, {}];
  }
  if (pairing.tournamentCompetitor1) {
    return [
      { competitor: pairing.tournamentCompetitor0 },
      { competitor: pairing.tournamentCompetitor1 },
    ];
  }
  return [
    { competitor: pairing.tournamentCompetitor0 },
    { placeholder: { displayName: 'Bye', icon: <ChevronRight /> } },
  ];
};
