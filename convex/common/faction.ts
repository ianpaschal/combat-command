import { Infer, v } from 'convex/values';

import { fowV4Faction } from './fowV4/fowV4Faction';

export const faction = v.union(
  fowV4Faction,
);

export type Faction = Infer<typeof faction>;
