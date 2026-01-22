import {
  Tournament,
  User,
  UserId,
  VisibilityLevel,
} from '~/api';

export const nameVisibilityChangeRequired = (
  tournament: Tournament,
  currentUser: User | null,
  selectedUserId: UserId | null,
): boolean => tournament.requireRealNames && currentUser?._id === selectedUserId && currentUser?.nameVisibility >= VisibilityLevel.Tournaments;
