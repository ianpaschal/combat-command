import {
  ColumnDef,
  CountryCell,
  DataTable,
  DefaultCell,
} from '~/components/generic/DataTable';
import { AggregateCompetitorResult } from '~/services/calculatePlayerRankings';
import { getUserDisplayName } from '~/utils/getUserDisplayName';

export interface FowV4RankingsTableProps {
  results: AggregateCompetitorResult[];
}

// TODO: This is based on competitors and tournaments. Make a separate component for player results
export const FowV4RankingsTable = ({
  results,
}: FowV4RankingsTableProps): JSX.Element => {
  const columnDefs: ColumnDef<AggregateCompetitorResult>[] = [
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
      render: (data) => <DefaultCell value={data.total_wins} />,
      width: '1fr',
    },
    {
      header: 'Points',
      render: (data) => <DefaultCell value={data.total_points} />,
      width: '1fr',
    },
    {
      header: 'Units Destroyed',
      render: (data) => <DefaultCell value={data.total_opponent_units_destroyed} />,
      width: '1fr',
    },
  ];
  return (
    <DataTable data={results} columns={columnDefs} includeLineNumbers />
  );
};