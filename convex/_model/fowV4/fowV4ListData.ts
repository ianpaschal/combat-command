import { ForceDiagram, Unit } from '@ianpaschal/combat-command-static-data/flamesOfWarV4';
import { v } from 'convex/values';

import { getStaticEnumConvexValidator } from '../common/_helpers/getStaticEnumConvexValidator';

const forceDiagram = getStaticEnumConvexValidator(ForceDiagram);
const unit = getStaticEnumConvexValidator(Unit);

export const fowV4ListData = v.object({
  meta: v.object({
    forceDiagram,
    pointsLimit: v.number(),
  }),
  formations: v.array(v.object({
    id: v.string(), // NanoId
    sourceId: unit,
  })),
  units: v.array(v.object({
    id: v.string(), // NanoId
    sourceId: unit,
    formationId: v.string(), // Formation NanoId or 'support'
    slotId: v.string(), // e.g. Armour 1
  })),
  commandCards: v.array(v.object({
    id: v.string(),
    sourceId: v.string(),
    appliedTo: v.string(), // Formation ID or unit ID
  })),
});
