import { ExtendedRankingFactor } from '@ianpaschal/combat-command-game-systems/common';
import { Infer } from 'convex/values';

import { Id } from '../../_generated/dataModel';
import { rankingFactor } from './rankingFactor';
import { scoreAdjustment } from './scoreAdjustment';
import { tournamentStatus } from './tournamentStatus';

export type TournamentStatus = Infer<typeof tournamentStatus>;

export type AnyBaseStats = Record<string, number>;

export type RankingFactor = Infer<typeof rankingFactor>;

export type ScoreAdjustment = Infer<typeof scoreAdjustment>;

export type TournamentPlayerMetadata<TBaseStats extends AnyBaseStats = AnyBaseStats> = {
  gamesPlayed: number;
  baseStats: {
    self: TBaseStats[];
    opponent: TBaseStats[];
  },
  rankingFactors?: Record<ExtendedRankingFactor<keyof TBaseStats & string>, number>;
};

export type TournamentPlayerRanked<TBaseStats extends AnyBaseStats = AnyBaseStats> = TournamentPlayerMetadata<TBaseStats> & {
  id: Id<'tournamentRegistrations'>
  rank: number;
  rankingFactors: Record<ExtendedRankingFactor<keyof TBaseStats & string>, number>;
};

export type TournamentCompetitorMetadata<TBaseStats extends AnyBaseStats = AnyBaseStats> = TournamentPlayerMetadata<TBaseStats> & {
  playedTables: number[];
  byeRounds: number[];
  opponentIds: Id<'tournamentCompetitors'>[];
};

export type TournamentCompetitorRanked<TBaseStats extends AnyBaseStats = AnyBaseStats> = TournamentCompetitorMetadata<TBaseStats> & {
  id: Id<'tournamentCompetitors'>;
  rank: number;
  rankingFactors: Record<ExtendedRankingFactor<keyof TBaseStats & string>, number>;
};
