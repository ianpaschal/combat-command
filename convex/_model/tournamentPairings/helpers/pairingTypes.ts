import { Infer, v } from 'convex/values';

import { TournamentRankings } from '../../tournaments/queries/getTournamentRankings';
import { uniqueFields } from '../fields';

export type DraftPairing = [RankedTournamentCompetitor, RankedTournamentCompetitor ];

export type PairingResult = {
  pairings: DraftPairing[];
  unpairedCompetitors: RankedTournamentCompetitor[];
};

/**
 * Ranked tournament competitor with stats and related data.
 */
export type RankedTournamentCompetitor = TournamentRankings['competitors'][number];

const uniqueFieldsSchema = v.object(uniqueFields);

export type PairingUniqueFields = Infer<typeof uniqueFieldsSchema>;
