import { Id } from '../../../_generated/dataModel';

export type DraftPairing = [RankedCompetitor, RankedCompetitor];
export type Bye = RankedCompetitor;

export type PairingResult = {
  pairings: DraftPairing[];
  unpairedCompetitors: RankedCompetitor[];
};

export type RankedCompetitor = {
  id: Id<'tournamentCompetitors'>;
  opponentIds: Id<'tournamentCompetitors'>[];
  byeRound?: number;
  rank: number; // Can't use index once we start moving competitors around
};
