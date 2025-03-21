import { Tournament } from '~/api';

export const getLocalizedCompetitorFee = (tournament: Tournament): string => {
  if (!tournament.competitorFee) {
    return 'Free';
  }
  const isTeam = tournament.competitorSize > 1;
  const { currency, amount } = tournament.competitorFee;
  const locale = navigator.language || 'en-US';
  const localizedFee = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount / 100 );
  return `${localizedFee} per ${isTeam ? 'team' : 'player'}`;
};
