import { ChevronRight } from 'lucide-react';

import { DraftTournamentPairing, TournamentPairing } from '~/api';
import { IdentityBadgeProps } from '~/components/IdentityBadge';
import { TournamentPairingFormItem } from '~/pages/TournamentPairingsPage/TournamentPairingsPage.schema';

export function isUnassignedPairingInput(pairing: unknown): pairing is DraftTournamentPairing {
  return typeof pairing === 'object' &&
    pairing !== null &&
    'tournamentCompetitor0Id' in pairing;
}

export function isTournamentPairing(pairing: unknown): pairing is TournamentPairing {
  return typeof pairing === 'object' &&
    pairing !== null &&
    'tournamentCompetitor0' in pairing;
}

export const getIdentityBadgeProps = (
  pairing?: TournamentPairing | TournamentPairingFormItem | DraftTournamentPairing,
): [Partial<IdentityBadgeProps>, Partial<IdentityBadgeProps>] => {
  if (isUnassignedPairingInput(pairing)) {
    if (pairing.tournamentCompetitor1Id) {
      return [
        { competitorId: pairing.tournamentCompetitor0Id },
        { competitorId: pairing.tournamentCompetitor1Id },
      ];
    }
    return [
      { competitorId: pairing.tournamentCompetitor0Id },
      { placeholder: { displayName: 'Bye', icon: <ChevronRight /> } },
    ];
  }

  if (isTournamentPairing(pairing)) {
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

  return [{}, {}];
};
