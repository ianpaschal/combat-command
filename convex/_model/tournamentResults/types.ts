import { ExtendedRankingFactor } from '@ianpaschal/combat-command-game-systems/common';
import { Infer } from 'convex/values';

import { Id } from '../../_generated/dataModel';
import { BaseStats } from '../common/types';
import { competitorResult, registrationResult } from './table';

export type CompetitorResult = Infer<typeof competitorResult>;

export type RegistrationResult = Infer<typeof registrationResult>;

export type TournamentPlayerMetadata<TBaseStats extends BaseStats = BaseStats> = {
  results: (TBaseStats & {
    opponentId: Id<'tournamentRegistrations'> | null;
  })[];
  rankingFactors?: Record<ExtendedRankingFactor<keyof TBaseStats & string>, number>;
};

export type TournamentCompetitorMetadata<TBaseStats extends BaseStats = BaseStats> = {
  results: (TBaseStats & {
    opponentId: Id<'tournamentCompetitors'> | null;
  })[];
  byeRounds: Set<number>;
  playedTables: Set<number>;
  rankingFactors?: Record<ExtendedRankingFactor<keyof TBaseStats & string>, number>;
};

export type TournamentAggregateData = {
  registrations: (RegistrationResult & {
    id: Id<'tournamentRegistrations'>;
  })[];
  competitors: (CompetitorResult & {
    id: Id<'tournamentCompetitors'>;
  })[];
};
