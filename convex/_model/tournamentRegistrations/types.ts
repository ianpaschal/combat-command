import { Infer } from 'convex/values';

import { deepenTournamentRegistration } from './_helpers/deepenTournamentRegistration';
import { createTournamentRegistrationArgs } from './mutations/createTournamentRegistration';
import { updateTournamentRegistrationArgs } from './mutations/updateTournamentRegistration';
import { Id } from '../../_generated/dataModel';
import { detailFields } from './table';
  
export type TournamentRegistration = Awaited<ReturnType<typeof deepenTournamentRegistration>>;
export type TournamentRegistrationCreateArgs = Infer<typeof createTournamentRegistrationArgs>;
export type TournamentRegistrationDetails = Infer<typeof detailFields>;
export type TournamentRegistrationId = Id<'tournamentRegistrations'>;
export type TournamentRegistrationUpdateArgs = Infer<typeof updateTournamentRegistrationArgs>;
