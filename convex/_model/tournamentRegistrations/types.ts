import { deepenTournamentRegistration } from './_helpers/deepenTournamentRegistration';
import { Id } from '../../_generated/dataModel';
  
export type TournamentRegistrationId = Id<'tournamentRegistrations'>;
export type TournamentRegistration = Awaited<ReturnType<typeof deepenTournamentRegistration>>;
