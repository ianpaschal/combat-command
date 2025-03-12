import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useQuery } from 'convex/react';

import { api, TournamentPairingId } from '~/api';
import { FormField } from '~/components/generic/Form';
import { InputNumber } from '~/components/generic/InputNumber';
import { InputSelect } from '~/components/generic/InputSelect';
import { Separator } from '~/components/generic/Separator';
import { fowV4BattlePlanOptions } from '~/types/fowV4/fowV4BattlePlanSchema';
import { getCompetitorPlayerOptions } from './TournamentPlayersFields.utils';

import styles from './TournamentPlayersFields.module.scss';

export interface TournamentPlayersFieldsProps {
  tournamentPairingId: TournamentPairingId;
}

export const TournamentPlayersFields = ({
  tournamentPairingId,
}: TournamentPlayersFieldsProps): JSX.Element => {
  const { setValue, watch } = useFormContext();
  const { player0UserId, player1UserId } = watch();

  // TODO: Handle loading state...
  const selectedPairing = useQuery(api.tournamentPairings.fetchTournamentPairing.fetchTournamentPairing, { id: tournamentPairingId });

  // Automatically set "Player 1" if possible
  const player0Options = useMemo(() => (
    getCompetitorPlayerOptions(selectedPairing?.tournamentCompetitor0)
  ), [selectedPairing]);
  useEffect(() => {
    if (player0Options && player0Options.length === 1 && player0UserId !== player0Options[0].value) {
      setValue('player0UserId', player0Options[0].value);
    }
  }, [player0Options, player0UserId, setValue]);

  // Automatically set "PLayer 2" if possible
  const player1Options = useMemo(() => (
    getCompetitorPlayerOptions(selectedPairing?.tournamentCompetitor1)
  ), [selectedPairing]);
  useEffect(() => {
    if (player1Options && player1Options.length === 1 && player1UserId !== player1Options[0].value) {
      setValue('player1UserId', player1Options[0].value);
    }
  }, [player1Options, player1UserId, setValue]);

  return (
    <div className={styles.Root}>
      <div className={styles.Player0Section}>
        <FormField name="player0UserId" label="Player 1" disabled={player0Options.length < 2}>
          <InputSelect options={player0Options} />
        </FormField>
        <FormField name="details.player0BattlePlan" label="Battle Plan">
          <InputSelect options={fowV4BattlePlanOptions} />
        </FormField>
        <FormField name="details.player0UnitsLost" label="Units Lost">
          <InputNumber min={0} />
        </FormField>
      </div>
      <Separator orientation="vertical" />
      <div className={styles.Player1Section}>
        <FormField name="player1UserId" label="Player 2" disabled={player1Options.length < 2}>
          <InputSelect options={player1Options} />
        </FormField>
        <FormField name="details.player1BattlePlan" label="Battle Plan">
          <InputSelect options={fowV4BattlePlanOptions} />
        </FormField>
        <FormField name="details.player1UnitsLost" label="Units Lost">
          <InputNumber min={0} />
        </FormField>
      </div>
    </div>
  );
};
