import { v } from 'convex/values';

export const tournamentPairingFields = {
  tournamentCompetitor0Id: v.id('tournamentCompetitors'),
  tournamentCompetitor1Id: v.id('tournamentCompetitors'),
  round: v.number(),
  table: v.number(),
};
