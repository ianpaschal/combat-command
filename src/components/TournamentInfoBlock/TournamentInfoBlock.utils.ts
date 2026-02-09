import {
  getTournamentPairingMethodByConfig,
  getTournamentPairingMethodDisplayName,
  TournamentPairingMethod,
} from '@ianpaschal/combat-command-game-systems/common';

import { Tournament } from '~/api';

export const getLocalizedCompetitorFee = (tournament: Tournament): string => {
  if (!tournament.competitorFee) {
    return 'Free';
  }
  const { currency, amount } = tournament.competitorFee;
  const locale = navigator.language || 'en-US';
  const localizedFee = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount / 100 );
  return `${localizedFee} per ${tournament.useTeams ? 'team' : 'player'}`;
};

export const getPairingMethod = (tournament: Tournament): string => {
  if (!tournament.pairingConfig) { // TODO: Remove after migration
    return 'Unknown';
  }
  const method = getTournamentPairingMethodByConfig(tournament.pairingConfig);
  return getTournamentPairingMethodDisplayName(method ?? TournamentPairingMethod.Custom) ?? 'Unknown';
};
