import clsx from 'clsx';

import { Card } from '~/components/generic/Card';
import {
  ColumnDef,
  DataTable,
  DefaultCell,
} from '~/components/generic/DataTable';
import { InputSelect } from '~/components/generic/InputSelect';
import { Label } from '~/components/generic/Label';
import { PairingCell } from '~/components/PairingCell';
import { TournamentCompetitor } from '~/types/TournamentCompetitor';
import { TournamentPairing } from '~/types/TournamentPairing';

type JoinedTournamentPairing = Omit<TournamentPairing, 'competitor_ids'> & { competitors: TournamentCompetitor[] };

const dummyPairings: JoinedTournamentPairing[] = [
  {
    tournament_id: 'foo', round: 0, table: 0, competitors: [
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'nl' },
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'be' },
    ],
  },
  {
    tournament_id: 'foo', round: 0, table: 0, competitors: [
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'nl' },
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'be' },
    ],
  },
  {
    tournament_id: 'foo', round: 0, table: 0, competitors: [
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'nl' },
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'be' },
    ],
  },
  {
    tournament_id: 'foo', round: 0, table: 0, competitors: [
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'nl' },
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'be' },
    ],
  },
  {
    tournament_id: 'foo', round: 0, table: 0, competitors: [
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'nl' },
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'be' },
    ],
  },
  {
    tournament_id: 'foo', round: 0, table: 0, competitors: [
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'nl' },
      { tournament_id: 'foo', user_ids: ['foo', 'bar', 'baz'], list_ids: ['foo', 'bar', 'baz'], country_code: 'be' },
    ],
  },
];

export const TournamentPairingsSection = (): JSX.Element => {
  const columnDefs: ColumnDef<JoinedTournamentPairing>[] = [
    {
      header: 'Table',
      render: (data) => <DefaultCell value={data.table + 1} />,
      width: '2.25rem',
    },
    {
      header: 'Team Name',
      render: (data) => <PairingCell data={data} />,
      width: '4fr',
    },

  ];
  return (
    <Card className={clsx('TournamentPairingsSection')} title="Pairings" disablePadding>
      <div>
        <Label>Round</Label>
        <InputSelect options={[{ value: 'all', label: 'All' }, { value: 'current', label: 'Current' }, '-', { value: 'round_0', label: 'Round 1' }]} />
      </div>
      <DataTable data={dummyPairings} columns={columnDefs} />
    </Card>
  );
};