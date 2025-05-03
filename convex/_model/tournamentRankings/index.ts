// Note: tournamentRankings don't exist within the database.
// They are generated from the underlying data.
// In SQL terms they would be a view instead of a table.
export {
  getTournamentRankings,
  getTournamentRankingsArgs,
} from './queries';
