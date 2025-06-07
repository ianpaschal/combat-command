import { ChevronRight } from 'lucide-react';

import {
  DraftPairing,
  TournamentPairing,
  UnassignedPairingInput,
} from '~/api';
import { IdentityBadgeProps } from '~/components/IdentityBadge';

export function isDraftPairing(pairing: unknown): pairing is DraftPairing {
  return Array.isArray(pairing) &&
    pairing.length > 0 &&
    typeof pairing[0] === 'object' &&
    pairing[0] !== null &&
    'id' in pairing[0];
}

export function isUnassignedPairingInput(pairing: unknown): pairing is UnassignedPairingInput {
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
  pairing?: TournamentPairing | DraftPairing | UnassignedPairingInput,
): [Partial<IdentityBadgeProps>, Partial<IdentityBadgeProps>] => {
  if (isDraftPairing(pairing)) {
    if (pairing[1]) {
      return [
        { competitorId: pairing[0].id },
        { competitorId: pairing[1].id },
      ];
    }
    return [
      { competitorId: pairing[0].id },
      { placeholder: { displayName: 'Bye', icon: <ChevronRight /> } },
    ];
  }

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
