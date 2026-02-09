import { Doc, Id } from '../../../_generated/dataModel';
import { QueryCtx } from '../../../_generated/server';
import { getTournamentRegistrationsByCompetitor } from '../../tournamentRegistrations';

export const getTournamentPairingUserIds = async (
  ctx: QueryCtx,
  doc: Doc<'tournamentPairings'>,
): Promise<Id<'users'>[]> => {
  const competitor0Registrations = doc.tournamentCompetitor0Id ? await getTournamentRegistrationsByCompetitor(ctx, {
    tournamentCompetitorId: doc.tournamentCompetitor0Id,
  }) : [];
  const competitor1Registrations = doc.tournamentCompetitor1Id ? await getTournamentRegistrationsByCompetitor(ctx, {
    tournamentCompetitorId: doc.tournamentCompetitor1Id,
  }) : [];
  return [
    ...competitor0Registrations.map((r) => r.userId),
    ...competitor1Registrations.map((r) => r.userId),
  ];
};
