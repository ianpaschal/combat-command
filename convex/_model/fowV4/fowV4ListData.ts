import { v } from 'convex/values';

import { fowV4FactionId } from '../../static/fowV4/factions';

export const fowV4ListData = v.object({
  meta: v.object({
    alignment: v.union(v.literal('axis'), v.literal('allies')),
    faction: fowV4FactionId,
    diagram: v.string(),
    points: v.number(),
  }),
  formations: v.array(v.object({
    id: v.string(),
    sourceId: v.string(),
  })),
  units: v.array(v.object({
    id: v.string(),
    sourceId: v.string(),
    formationId: v.string(), // Formation ID or 'support'
    slotId: v.string(), // e.g. Armour 1
  })),
  commandCards: v.array(v.object({
    id: v.string(),
    sourceId: v.string(),
    appliedTo: v.string(), // Formation ID or unit ID
  })),
});
