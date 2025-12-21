import { ExtendedRankingFactor } from '@ianpaschal/combat-command-game-systems/common';
import { Infer } from 'convex/values';

import { Id } from '../../_generated/dataModel';
import { BaseStats } from '../common/types';
import { competitorResult, userResult } from './table';

export type TournamentUserResult = Infer<typeof userResult>;

export type TournamentUserMetadata<TBaseStats extends BaseStats = BaseStats> = {
  results: (TBaseStats & {
    opponentId: Id<'users'> | null;
  })[];
  rankingFactors?: Record<ExtendedRankingFactor<keyof TBaseStats & string>, number>;
};

export type CompetitorResult = Infer<typeof competitorResult>;

export type TournamentCompetitorMetadata<TBaseStats extends BaseStats = BaseStats> = {
  results: (TBaseStats & {
    opponentId: Id<'tournamentCompetitors'> | null;
  })[];
  byeRounds: Set<number>;
  playedTables: Set<number>;
  rankingFactors?: Record<ExtendedRankingFactor<keyof TBaseStats & string>, number>;
};

export type TournamentAggregateData = {
  users: (TournamentUserResult & {
    id: Id<'users'>;
  })[];
  competitors: (CompetitorResult & {
    id: Id<'tournamentCompetitors'>;
  })[];
};
