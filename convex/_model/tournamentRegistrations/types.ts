import { Infer, v } from 'convex/values';

import { deepenTournamentRegistration } from './_helpers/deepenTournamentRegistration';
import { Id } from '../../_generated/dataModel';
import { editableFields } from './table';
  
export type TournamentRegistrationId = Id<'tournamentRegistrations'>;
export type TournamentRegistration = Awaited<ReturnType<typeof deepenTournamentRegistration>>;
const formData = v.object(editableFields);
export type TournamentRegistrationFormData = Infer<typeof formData>;
