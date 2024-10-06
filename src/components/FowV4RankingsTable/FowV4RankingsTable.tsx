import { dummyRankings } from '~/components/FowV4RankingsTable/dummyRankings';
import {
  ColumnDef,
  CountryCell,
  DataTable,
  DefaultCell,
} from '~/components/generic/DataTable';
import { TournamentCompetitor } from '~/types/TournamentCompetitor';

interface FowV4Ranking {
  competitor: Omit<TournamentCompetitor, 'tournament_id' | 'list_ids'>;
  wins: number;
  points: number;
  kills: number;
}

export const FowV4RankingsTable = (): JSX.Element => {

  const columnDefs: ColumnDef<FowV4Ranking>[] = [
    {
      header: 'Team Name',
      render: ({ competitor }) => {
        if (competitor.user_ids.length > 1) {
          if (competitor.country_code) {
            return (<CountryCell code={competitor.country_code} />);
          }
          if (competitor.team_name) {
            return (<DefaultCell value={competitor.team_name} />);
          }
          return (<DefaultCell value="Unknown Team" />);
        }
        return (<DefaultCell value={competitor.user_ids[0]} />);
      },
      width: '2fr',
    },
    {
      header: 'Wins',
      render: (data) => <DefaultCell value={data.wins} />,
      width: '1fr',
    },
    {
      header: 'Points',
      render: (data) => <DefaultCell value={data.points} />,
      width: '1fr',
    },
    {
      header: 'Kills',
      render: (data) => <DefaultCell value={data.kills} />,
      width: '1fr',
    },
  ];
  return (
    <DataTable data={dummyRankings} columns={columnDefs} includeLineNumbers />
  );
};