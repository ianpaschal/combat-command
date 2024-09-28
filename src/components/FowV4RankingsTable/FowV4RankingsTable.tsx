import {
  ColumnDef,
  DataTable,
  DefaultCell,
} from '~/components/generic/DataTable';

interface FowV4Ranking {
  name: string;
  wins: number;
  points: number;
  kills: number;
}

export const FowV4RankingsTable = (): JSX.Element => {

  const columnDefs: ColumnDef<FowV4Ranking>[] = [
    {
      header: 'Team Name',
      render: (data) => <DefaultCell value={data.name} />,
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
  const rankings: FowV4Ranking[] = [
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
    {
      name: 'Foo',
      wins: 5,
      points: 15,
      kills: 30,
    },
  ];
  return (
    <DataTable data={rankings} columns={columnDefs} includeLineNumbers />
  );
};