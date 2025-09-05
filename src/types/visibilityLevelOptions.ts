import { VisibilityLevel } from '~/api';

export const visibilityLevelOptions = [
  {
    value: VisibilityLevel.Hidden,
    label: 'Hidden',
  },
  {
    value: VisibilityLevel.Friends,
    label: 'Friends',
  },
  {
    value: VisibilityLevel.Clubs,
    label: 'Clubs',
  },
  {
    value: VisibilityLevel.Tournaments,
    label: 'Tournaments',
  },
  {
    value: VisibilityLevel.Community,
    label: 'Community',
  },
  {
    value: VisibilityLevel.Public,
    label: 'Public',
  },
];
