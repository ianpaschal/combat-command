import { Infer } from 'convex/values';

import { deepenTournamentRegistration } from './_helpers/deepenTournamentRegistration';
import { Id } from '../../_generated/dataModel';
import { detailFields } from './table';
  
export type TournamentRegistrationId = Id<'tournamentRegistrations'>;
export type TournamentRegistration = Awaited<ReturnType<typeof deepenTournamentRegistration>>;
export type TournamentRegistrationDetails = Infer<typeof detailFields>;
