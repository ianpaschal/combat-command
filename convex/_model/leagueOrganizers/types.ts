import { deepenLeagueOrganizer } from './_helpers/deepenLeagueOrganizer';
import { Id } from '../../_generated/dataModel';
  
export type LeagueOrganizerId = Id<'leagueOrganizers'>;
export type LeagueOrganizer = Awaited<ReturnType<typeof deepenLeagueOrganizer>>;
