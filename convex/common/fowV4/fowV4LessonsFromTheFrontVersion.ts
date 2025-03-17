import { Infer, v } from 'convex/values';

import { lessonsFromTheFrontVersions } from '../../static/fowV4/lessonsFromTheFrontVersions';

export const fowV4LessonsFromTheFrontVersion = v.union(
  ...lessonsFromTheFrontVersions.map(({ id }) => v.literal(id)),
);

export type FowV4LessonsFromTheFrontVersion = Infer<typeof fowV4LessonsFromTheFrontVersion>;
