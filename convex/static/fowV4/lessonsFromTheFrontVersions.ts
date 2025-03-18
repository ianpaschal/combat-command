import { Infer, v } from 'convex/values';

export const lessonsFromTheFrontVersions = [
  {
    id: 'flames_of_war_v4::lessons_from_the_front::2018_12',
    displayName: 'December 2018',
    publishedAt: '2018-12-01T13:00:00+13:00',
  },
  {
    id: 'flames_of_war_v4::lessons_from_the_front::2019_10',
    displayName: 'October 2019',
    publishedAt: '2019-10-01T13:00:00+13:00',
  },
  // Presumably 1 or 2 missing...
  {
    id: 'flames_of_war_v4::lessons_from_the_front::2023_03',
    displayName: 'March 2023',
    publishedAt: '2023-03-01T13:00:00+13:00',
  },
  {
    id: 'flames_of_war_v4::lessons_from_the_front::2024_03',
    displayName: 'March 2024',
    publishedAt: '2023-03-01T13:00:00+13:00',
  },
] as const;

export const fowV4LessonsFromTheFrontVersionOptions = lessonsFromTheFrontVersions.map((version) => ({
  value: version.id,
  label: version.displayName,
}));
// TODO: Sort by date

export const lessonsFromTheFrontVersionId = v.union(...lessonsFromTheFrontVersions.map(({ id }) => v.literal(id)));

export type LessonsFromTheFrontVersionId = Infer<typeof lessonsFromTheFrontVersionId>;
