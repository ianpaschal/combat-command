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
import { TournamentPairingsResponse } from '~/services/tournaments/fetchTournamentPairings';
import { useFetchTournamentParingsByTournamentId } from '~/services/tournaments/fetchTournamentPairingsByTournamentId';

export interface TournamentPairingsSectionProps {
  tournamentId: string;
}

export const TournamentPairingsSection = ({
  tournamentId,
}: TournamentPairingsSectionProps): JSX.Element => {
  const { data: pairingsList } = useFetchTournamentParingsByTournamentId(tournamentId);
  const columnDefs: ColumnDef<TournamentPairingsResponse>[] = [
    {
      header: 'Table',
      render: (data) => <DefaultCell value={data.table_index + 1} />,
      width: '2.25rem',
    },
    {
      header: 'Team Name',
      render: (data) => <PairingCell data={data} />,
      width: '4fr',
    },

  ];
  console.log(pairingsList);
  return (
    <Card className={clsx('TournamentPairingsSection')} title="Pairings" disablePadding>
      <div>
        <Label>Round</Label>
        <InputSelect options={[{ value: 'all', label: 'All' }, { value: 'current', label: 'Current' }, '-', { value: 'round_0', label: 'Round 1' }]} />
      </div>
      <DataTable data={pairingsList || []} columns={columnDefs} />
    </Card>
  );
};