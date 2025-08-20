import { deepenTournamentOrganizer } from './_helpers/deepenTournamentOrganizer';
import { Id } from '../../_generated/dataModel';
  
export type TournamentOrganizerId = Id<'tournamentOrganizers'>;
export type TournamentOrganizer = Awaited<ReturnType<typeof deepenTournamentOrganizer>>;
