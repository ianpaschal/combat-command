import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { baseStats } from '../common/baseStats';
import { rankingFactorValues } from '../common/rankingFactor';

/**
 * Fields which are used to create a record.
 */
export const editableFields = {
  tournamentId: v.id('tournaments'),
  round: v.number(),
};

export const playerBaseStats = v.object({
  self: v.array(baseStats),
  opponent: v.array(baseStats),
});

export const playerResultFields = {
  gamesPlayed: v.number(),
  rank: v.number(),
  rankingFactors: rankingFactorValues,
};

export const registrationResult = v.object(playerResultFields);

/**
 * Kept separate from main definition for type extraction.
 */
export const competitorResultFields = {
  ...playerResultFields,
  opponentIds: v.array(v.id('tournamentCompetitors')),
  playedTables: v.array(v.number()),
  byeRounds: v.array(v.number()),
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
  competitors: v.array(v.object({
    id: v.id('tournamentCompetitors'),
    ...competitorResultFields,
  })),

  /** Auto-calculated on create/update, or by trigger if underlying data changes. */
  registrations: v.array(v.object({
    id: v.id('tournamentRegistrations'), 
    ...playerResultFields,
  })),
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_tournament_round', ['tournamentId','round'])
  .index('by_game_system_round', ['gameSystem','round']);
