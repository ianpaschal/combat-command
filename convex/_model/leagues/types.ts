import { Infer } from 'convex/values';

import { deepenLeague } from './_helpers/deepenLeague';
import { Id } from '../../_generated/dataModel';
import { leagueStatus } from '../common/leagueStatus';
import { LeagueRanking } from '../leagueRankings';
import { LimitedUser } from '../users';

export type League = Awaited<ReturnType<typeof deepenLeague>>;
export type LeagueId = Id<'leagues'>;
export type LeagueStatus = Infer<typeof leagueStatus>;
export type RankedLeagueUser = LimitedUser & Omit<LeagueRanking, 'userId'>;
