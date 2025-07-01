import { TournamentCompetitorId, TournamentCompetitorRanked } from '~/api';

export type PairingsGridState = Record<TournamentCompetitorId, string>;

export type DraftTournamentPairing = [TournamentCompetitorRanked | null, TournamentCompetitorRanked | null];
