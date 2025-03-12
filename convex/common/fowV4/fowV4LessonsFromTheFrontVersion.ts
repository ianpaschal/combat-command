import { Infer, v } from 'convex/values';

export const fowV4LessonsFromTheFrontVersion = v.union(
  v.literal('lessons_from_the_front_2018_12'),
  v.literal('lessons_from_the_front_2019_10'),
  v.literal('lessons_from_the_front_2020_10'),
  // Presumably 1 or 2 missing...
  v.literal('lessons_from_the_front_2023_03'),
  v.literal('lessons_from_the_front_2024_03'),
);

export type FowV4LessonsFromTheFrontVersion = Infer<typeof fowV4LessonsFromTheFrontVersion>;
