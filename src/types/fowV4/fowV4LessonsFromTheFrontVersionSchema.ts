import { z, ZodLiteral } from 'zod';

export const fowV4LessonsFromTheFrontVersionSchema = z.union([
  z.literal('lessons_from_the_front_2018_12'),
  z.literal('lessons_from_the_front_2019_10'),
  z.literal('lessons_from_the_front_2020_10'),
  // Presumably 1 or 2 missing...
  z.literal('lessons_from_the_front_2023_03'),
  z.literal('lessons_from_the_front_2024_03'),
]);

export type FowV4LessonsFromTheFrontVersion = z.infer<typeof fowV4LessonsFromTheFrontVersionSchema>;

export const fowV4LessonsFromTheFrontVersionLabels: Record<FowV4LessonsFromTheFrontVersion, string> = {
  lessons_from_the_front_2018_12: 'December 2018',
  lessons_from_the_front_2019_10: 'October 2019',
  lessons_from_the_front_2020_10: 'October 2020',
  lessons_from_the_front_2023_03: 'March 2023',
  lessons_from_the_front_2024_03: 'March 2024 (Latest)',
};

export const fowV4LessonsFromTheFrontVersionOptions = fowV4LessonsFromTheFrontVersionSchema.options.filter(
  (option) => option instanceof ZodLiteral,
).map(
  ({ value }) => ({ value, label: fowV4LessonsFromTheFrontVersionLabels[value] }),
);
