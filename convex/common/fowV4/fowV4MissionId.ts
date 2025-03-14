import { Infer, v } from 'convex/values';

import { missionPacks } from '../../static/fowV4/missionPacks';
import { FowV4Mission } from '../../static/fowV4/missionPacks.types';

export const fowV4MissionId = v.union(
  ...missionPacks.reduce((acc: FowV4Mission[], missionPack) => [
    ...acc,
    ...missionPack.missions,
  ], []).map(({ id }) => v.literal(id)),
);

export type FowV4MissionId = Infer<typeof fowV4MissionId>;
