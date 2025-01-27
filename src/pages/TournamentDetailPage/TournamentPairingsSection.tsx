import { useState } from 'react';

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

import styles from './TournamentPairingsSection.module.scss';

export interface TournamentPairingsSectionProps {
  tournamentId: string;
}

export const TournamentPairingsSection = ({
  tournamentId,
}: TournamentPairingsSectionProps): JSX.Element => {
  const { data: pairings } = useFetchTournamentParingsByTournamentId(tournamentId);

  const [round, setRound] = useState<number>(0);

  const roundOptions = [...new Set(
    (pairings || []).map(
      (pairing) => pairing.round_index,
    ).filter(
      (roundIndex) => roundIndex !== undefined,
    ),
  )].map(round => ({
    value: round,
    label: `Round ${round + 1}`,
  }));

  const handleChangeRound = (value: null | number | string | undefined): void => {
    if (typeof value === 'number') {
      setRound(value);
    }
  };

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

  const processedData = (pairings || []).filter((pairing) => pairing.round_index === round).sort((a, b) => a.table_index - b.table_index);

  return (
    <Card title="Pairings" disablePadding>
      {roundOptions.length > 1 && (
        <div className={styles.Controls}>
          <Label>Round</Label>
          <InputSelect options={roundOptions} value={round} onChange={handleChangeRound} disabled={roundOptions.length < 2} />
        </div>
      )}
      <DataTable className={styles.DataTable} data={processedData} columns={columnDefs} />
    </Card>
  );
};