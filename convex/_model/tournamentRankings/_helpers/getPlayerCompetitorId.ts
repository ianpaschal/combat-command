import { Doc, Id } from '../../../_generated/dataModel';

export const getPlayerCompetitorId = (
  userId: Id<'users'>,
  tournamentCompetitors: Doc<'tournamentCompetitors'>[],
): Id<'tournamentCompetitors'> | undefined => tournamentCompetitors.find(
  (competitor) => competitor.players.map(
    (p) => p.userId,
  ).includes(userId),
)?._id;
