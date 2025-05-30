import { Infer, v } from 'convex/values';

import { Id } from '../../../_generated/dataModel';
import { ExtendedResultData } from '../../tournamentRankings/types';
import { uniqueFields } from '../fields';

export type DraftPairing = [RankedCompetitor, RankedCompetitor ];

export type PairingResult = {
  pairings: DraftPairing[];
  unpairedCompetitors: RankedCompetitor[];
};

export type RankedCompetitor = ExtendedResultData<Id<'tournamentCompetitors'>> & {
  id: Id<'tournamentCompetitors'>;
  rank: number | null; // Can't use index once we start moving competitors around
};

const uniqueFieldsSchema = v.object(uniqueFields);

export type PairingUniqueFields = Infer<typeof uniqueFieldsSchema>;
