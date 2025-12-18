import { deepenLeagueOrganizer } from './_helpers/deepenLeagueOrganizer';
import { Id } from '../../_generated/dataModel';
  
export type LeagueOrganizerId = Id<'tournamentOrganizers'>;
export type LeagueOrganizer = Awaited<ReturnType<typeof deepenLeagueOrganizer>>;
