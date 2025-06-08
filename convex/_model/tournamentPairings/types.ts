import { Infer, v } from 'convex/values';

import { TournamentRankings } from '../tournaments/queries/getTournamentRankings';
import { uniqueFields } from './fields';

/**
 * Ranked TournamentCompetitor with additional stats and related data.
 */
export type RankedTournamentCompetitor = TournamentRankings['competitors'][number];

/**
 * A tuple of RankedTournamentCompetitors to be paired.
 */
export type DraftTournamentPairing = [RankedTournamentCompetitor, RankedTournamentCompetitor];

/**
 * A draft of potential TournamentPairings.
 */
export type DraftTournamentPairings = {
  pairings: DraftTournamentPairing[];
  unpairedCompetitors: RankedTournamentCompetitor[];
};

const uniqueFieldsSchema = v.object(uniqueFields);

export type PairingUniqueFields = Infer<typeof uniqueFieldsSchema>;
