import { GameSystem } from '@ianpaschal/combat-command-game-systems/common';
import { defineTable } from 'convex/server';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';
import { leagueStatus } from '../common/leagueStatus';
import { rankingFactor } from '../common/rankingFactor';
const gameSystem = getStaticEnumConvexValidator(GameSystem);

export const editableFields = {
  title: v.string(),
  description: v.string(),
  logoStorageId: v.optional(v.union(v.id('_storage'))),
  logoWrapper: v.optional(v.object({
    shape: v.union(
      v.literal('round'),
      v.literal('hexagon'),
      v.literal('shield'),
      v.literal('square'),
    ),
    borderColor: v.optional(v.string()),
    backgroundColor: v.string(),
  })),
  bannerBackground: v.optional(v.object({
    pattern: v.union(
      v.literal('bamboo'),
      v.literal('bank_note'),
      v.literal('diagonal_lines'),
      v.literal('endless_clouds'),
      v.literal('graph_paper'),
      v.literal('hexagons'),
      v.literal('morphing_diamonds'),
      v.literal('plus'),
      v.literal('rain'),
      v.literal('texture'),
    ),
    color: v.string(),
  })),
  bannerStorageId: v.optional(v.union(v.id('_storage'))),
  editionYear: v.number(),
  startsAt: v.number(),
  endsAt: v.number(),

  // Tournaments
  tournamentIds: v.array(v.id('tournaments')),

  // Format
  gameSystem,
  rankingFactors: v.array(rankingFactor),
  participationThreshold: v.number(),
  limitResults: v.optional(v.number()),
};

export const computedFields = {
  modifiedAt: v.optional(v.number()),
  refreshedAt: v.optional(v.number()),
  status: leagueStatus,
};

export default defineTable({
  ...editableFields,
  ...computedFields,
})
  .index('by_game_system', ['gameSystem'])
  .index('by_status', ['status']);
