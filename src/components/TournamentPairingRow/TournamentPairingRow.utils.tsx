import { ChevronRight } from 'lucide-react';

import { DraftPairing, TournamentPairing } from '~/api';
import { IdentityBadgeProps } from '~/components/IdentityBadge';

export const getIdentityBadgeProps = (
  pairing?: TournamentPairing | DraftPairing,
): [Partial<IdentityBadgeProps>, Partial<IdentityBadgeProps>] => {

  // If it's a draft pairing
  if (pairing && Array.isArray(pairing)) {
    return [
      { competitorId: pairing[0].id },
      { competitorId: pairing[1].id },
    ];
  }

  // If it's a real pairing
  if (pairing && pairing.tournamentCompetitor0) {
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
  }

  return [
    {}, {},
  ];
};
