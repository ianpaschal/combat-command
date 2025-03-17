export const lessonsFromTheFrontVersions = [
  {
    id: '8ded33f6-4632-4c76-9b87-11e688087090',
    displayName: 'December 2018',
    publishedAt: '2018-12-01T13:00:00+13:00',
  },
  {
    id: '41037a4d-6700-463a-88c4-f1ba0551819a',
    displayName: 'October 2019',
    publishedAt: '2019-10-01T13:00:00+13:00',
  },
  // Presumably 1 or 2 missing...
  {
    id: '8f71f60e-0c2d-46c7-b479-d8ec3c285476',
    displayName: 'March 2023',
    publishedAt: '2023-03-01T13:00:00+13:00',
  },
  {
    id: 'b8d046fa-8040-4c22-891a-b1a33c94fd87',
    displayName: 'March 2024',
    publishedAt: '2023-03-01T13:00:00+13:00',
  },
] as const;

export const fowV4LessonsFromTheFrontVersionOptions = lessonsFromTheFrontVersions.map((version) => ({
  value: version.id,
  label: version.displayName,
}));
// TODO: Sort by date
