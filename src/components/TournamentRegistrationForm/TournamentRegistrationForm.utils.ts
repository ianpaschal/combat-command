import {
  Tournament,
  User,
  VisibilityLevel,
} from '~/api';

export type AdditionalRequiredFields = {
  nameVisibilityConsent: boolean;
};

export const getAdditionalRequiredFields = (
  tournament: Tournament,
  user: User | null,
): AdditionalRequiredFields => ({
  nameVisibilityConsent: !!(tournament.requireRealNames && user && user.nameVisibility < VisibilityLevel.Tournaments),
});
