import { v } from 'convex/values';

export const tournamentPlayer = v.object({
  tournamentRegistrationId: v.id('tournamentRegistrations'),
  userId: v.id('users'),
  active: v.boolean(),
});
