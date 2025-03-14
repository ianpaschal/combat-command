import { Infer, v } from 'convex/values';

import { missionPacks } from '../../static/fowV4/missionPacks';
import { FowV4MissionMatrix } from '../../static/fowV4/missionPacks.types';

export const fowV4MissionMatrixId = v.union(
  ...missionPacks.reduce((acc: FowV4MissionMatrix[], missionPack) => [
    ...acc,
    ...missionPack.matrixes,
  ], []).map(({ id }) => v.literal(id)),
);

export type FowV4MissionMatrixId = Infer<typeof fowV4MissionMatrixId>;
