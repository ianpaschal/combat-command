import { Infer } from 'convex/values';

import { deepenLeagueRanking } from './_helpers/deepenLeagueRanking';
import { Id } from '../../_generated/dataModel';
import { RegistrationResult } from '../tournamentResults';
import { leagueRankingInput } from './table';

export type LeagueRankingId = Id<'leagueRankings'>;
export type LeagueRankingInput = Infer<typeof leagueRankingInput>;
export type LeagueRanking = Awaited<ReturnType<typeof deepenLeagueRanking>>;
export type LeagueRankingFullResult = RegistrationResult & {
  tournament?: {
    title: string;
    editionYear?: number;
    startsAt: number;
  },
};
