import { Infer, v } from 'convex/values';

export const tournamentStatus = v.union(
  v.literal('draft'), 
  v.literal('published'),
  v.literal('active'),
  v.literal('archived'),
);

export type TournamentStatus = Infer<typeof tournamentStatus>;
