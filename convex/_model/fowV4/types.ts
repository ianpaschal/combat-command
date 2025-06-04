import { Id } from '../../_generated/dataModel';
import { FowV4RankingFactor } from '../../static/fowV4/fowV4RankingFactors';

/**
 * The base stats which all other values are calculated from.
 * Can pertain to a competitor/team or player/user.
 * 
 * NOTE: Snake case is used so that each key can easily be mapped to a FowV4RankingFactor.
 */
export type FowV4BaseStats = {
  wins: number;
  points: number;
  units_destroyed: number;
  units_lost: number;
};

/**
 * 
 * This is used to quickly gather data from match results and then sum, average, etc. later.
 */
export type FowV4TournamentDiscretePlayerStats = {
  opponent: FowV4BaseStats[];
  self: FowV4BaseStats[];
};

/**
 * The extended stats which include all ranking factors, structured by type.
 * Can pertain to a competitor/team or player/user.
 * 
 * NOTE: Snake case is used so that each key can easily be mapped to a FowV4RankingFactor.
 */
export type FowV4TournamentExtendedStats = {
  average_opponent: FowV4BaseStats;
  average: FowV4BaseStats;
  total_opponent: FowV4BaseStats;
  total: FowV4BaseStats;
  gamesPlayed: number;
};

/**
 * The extended stats which include all ranking factors, flattened.
 * Can pertain to a competitor/team or player/user.
 */
export type FowV4TournamentFlatExtendedStats = Record<FowV4RankingFactor, number>;

/**
 * Virtually identical to AggregateFowV4TournamentData, but includes a rank property.
 */
export type FowV4TournamentRankings = {
  players: {
    userId: Id<'users'>;
    stats: FowV4TournamentFlatExtendedStats;
    rank: number;
  }[];
  competitors: (TournamentCompetitorMeta & {
    tournamentCompetitorId: Id<'tournamentCompetitors'>;
    stats: FowV4TournamentFlatExtendedStats;
    rank: number;
  })[];
};

export type FowV4StatId = Id<'users'> | Id<'tournamentCompetitors'>;

// TODO: Move this out of the fowV4 folder

/**
 * Non-stats tournament data for a competitor.
 */
export type TournamentCompetitorMeta = {
  opponentIds: Id<'tournamentCompetitors'>[];
  playedTables: number[];
  byeRounds: number[];
};
