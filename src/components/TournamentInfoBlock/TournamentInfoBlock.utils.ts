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
