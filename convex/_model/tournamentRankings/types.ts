import { Id } from '../../_generated/dataModel';

export type AllowedIds = Id<'users'> | Id<'tournamentCompetitors'>;

/**
 * Abstract result data for any context (per competitor, per player, per match, etc.)
 * TODO: This is FowV4 specific. Prefix it as such.
 * Consider making a Record<FowV4RankingFactor, number>.
 */
export type ResultData = {
  wins: number;
  points: number;
  unitsDestroyed: number;
  unitsLost: number;
};

/**
 * Extends abstract ResultData with a specific round and opponent.
 * Can still be per competitor or per player (generic T).
 */
export type RoundResultData<T extends AllowedIds> = ResultData & {
  round: number;
  table: number | null;
  opponentId: T | null;
};

/**
 * Aggregation of RoundResultData, mapped by ID (competitor or user/player).
 * Map containing all results per competitor.
 */
export type AggregateRoundResults<T extends AllowedIds> = Record<T, (RoundResultData<T>)[]>;

/**
 * Collection of several sets of ResultData, with various operations applied (totalled, averaged, etc.).
 * Also includes an array of opponent IDs (competitor or user/player) and bye rounds.
 */
export type ExtendedResultData<T extends AllowedIds> = {
  total: ResultData;
  average: ResultData;
  averageOpponent: ResultData;
  opponentIds: (T | null)[];
  playedTables: (number | null)[];
  byeRounds: number[];
};
export type AggregateTournamentResult<T extends AllowedIds> = Record<T, ExtendedResultData<T>>;
export type TournamentResultsByCompetitor = AggregateTournamentResult<Id<'tournamentCompetitors'>>;
export type TournamentResultsByPlayer = AggregateTournamentResult<Id<'users'>>;
