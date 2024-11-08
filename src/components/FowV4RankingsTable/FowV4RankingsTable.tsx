import {
  ColumnDef,
  CountryCell,
  DataTable,
  DefaultCell,
} from '~/components/generic/DataTable';
import { FowV4RankingFactor } from '~/types/fowV4/fowV4RankingFactorSchema';
import { CompetitorResult } from '~/utils/common/calculateTournamentRankings';
import { getUserDisplayName } from '~/utils/common/getUserDisplayName';

export interface FowV4RankingsTableProps {
  results: CompetitorResult<FowV4RankingFactor>[];
}

// TODO: This is based on competitors and tournaments. Make a separate component for player results
export const FowV4RankingsTable = ({
  results,
}: FowV4RankingsTableProps): JSX.Element => {
  const columnDefs: ColumnDef<CompetitorResult<FowV4RankingFactor>>[] = [
    {
      header: 'Team Name',
      render: ({ competitor }) => {
        if (competitor.players.length > 1) {
          if (competitor.country_code) {
            return (<CountryCell code={competitor.country_code} />);
          }
          if (competitor.team_name) {
            return (<DefaultCell value={competitor.team_name} />);
          }
          return (<DefaultCell value="Unknown Team" />);
        }
        return (<DefaultCell value={getUserDisplayName(competitor.players[0].profile)} />);
      },
      width: '2fr',
    },
    {
      header: 'Wins',
      render: (data) => <DefaultCell value={data.result.total_wins} />,
      width: '1fr',
    },
    {
      header: 'Points',
      render: (data) => <DefaultCell value={data.result.total_points} />,
      width: '1fr',
    },
    {
      header: 'Units Destroyed',
      render: (data) => <DefaultCell value={data.result.total_units_destroyed} />,
      width: '1fr',
    },
    {
      header: 'Avg. Opponent Points',
      render: (data) => <DefaultCell value={data.result.avg_opponent_points} />,
      width: '1fr',
    },
  ];
  const emptyState = (
    <div>
      No matches yet!
    </div>
  );
  return (
    <DataTable data={results} columns={columnDefs} includeLineNumbers emptyState={emptyState} />
  );
};