import { Infer, v } from 'convex/values';

import { missionPacks } from '../../static/fowV4/missionPacks';

export const fowV4MissionPackId = v.union(...missionPacks.map(({ id }) => v.literal(id)));

export type FowV4MissionPackId = Infer<typeof fowV4MissionPackId>;
