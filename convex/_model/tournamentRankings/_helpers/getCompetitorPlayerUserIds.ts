import { Doc, Id } from '../../../_generated/dataModel';

export const getCompetitorPLayerUserIds = (
  id: Id<'tournamentCompetitors'>,
  competitors: Doc<'tournamentCompetitors'>[],
): Id<'users'>[] => (competitors.find((c) => c._id === id)?.players || [])
  .map((p) => p.userId)
  .filter((userId) => !!userId);
