import { Id } from '../../_generated/dataModel';

export type AllowedIds = Id<'users'> | Id<'tournamentCompetitors'>;

export type ResultData = {
  wins: number;
  points: number;
  unitsDestroyed: number;
  unitsLost: number;
};

export type ExtendedResultData<T extends AllowedIds> = {
  total: ResultData;
  average: ResultData;
  averageOpponent: ResultData;
  opponentIds: T[];
};

export type AggregateTournamentResult<T extends AllowedIds> = Record<T, ExtendedResultData<T>>;

export type TournamentResultsByCompetitor = AggregateTournamentResult<Id<'tournamentCompetitors'>>;

export type TournamentResultsByPlayer = AggregateTournamentResult<Id<'users'>>;
