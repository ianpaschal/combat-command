import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { rankingFactorValues } from '../common/rankingFactor';

export const editableFields = {
  tournamentId: v.id('tournaments'),
  round: v.number(),
};

const sharedResultFields = {
  gamesPlayed: v.number(),
  rank: v.number(),
  rankingFactors: rankingFactorValues,
};

export const userResultFields = {
  ...sharedResultFields,
  opponentIds: v.optional(v.array(v.id('users'))),
};

export const userResult = v.object(userResultFields);

export const competitorResultFields = {
  ...sharedResultFields,
  opponentIds: v.array(v.id('tournamentCompetitors')),
  playedTables: v.array(v.number()), // Only used for pairing, so only needed on competitor level
  byeRounds: v.array(v.number()), // Only used for pairing, so only needed on competitor level
};

export const competitorResult = v.object(competitorResultFields);

/**
 * Fields which can only be edited using special mutations, or which are set programmatically.
 */
export const computedFields = {
  /** Extracted from tournament (via tournamentId) on create/update for easier indexing. */
  gameSystem: v.string(),

  /** Auto-set on update. */
  modifiedAt: v.optional(v.number()),

  /** Auto-calculated on create/update, or by trigger if underlying data changes. */
  users: v.optional(v.array(v.object({
    id: v.id('users'), 
    ...userResultFields,
  }))),

  /** Auto-calculated on create/update, or by trigger if underlying data changes. */
  registrations: v.optional(v.array(v.object({
    ...sharedResultFields,
    id: v.id('tournamentRegistrations'), 
    opponentIds: v.optional(v.array(v.id('tournamentRegistrations'))),
  }))),
  
  /** Auto-calculated on create/update, or by trigger if underlying data changes. */
  competitors: v.array(v.object({
    id: v.id('tournamentCompetitors'),
    ...competitorResultFields,
  })),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_tournament', ['tournamentId'])
  .index('by_tournament_round', ['tournamentId','round'])
  .index('by_game_system_round', ['gameSystem','round']);
