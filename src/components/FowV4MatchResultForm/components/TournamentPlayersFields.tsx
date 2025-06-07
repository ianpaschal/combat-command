import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { fowV4BattlePlanOptions, TournamentPairingId } from '~/api';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { useGetTournamentPairing } from '~/services/tournamentPairings';
import { getTournamentCompetitorDisplayName } from '~/utils/common/getTournamentCompetitorDisplayName';
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

  const { data: selectedPairing } = useGetTournamentPairing({ id: tournamentPairingId });

  const player0Label = `${getTournamentCompetitorDisplayName(selectedPairing?.tournamentCompetitor0)} Player`;
  const player1Label = `${getTournamentCompetitorDisplayName(selectedPairing?.tournamentCompetitor1)} Player`;

  const player0Options = useMemo(() => (
    getCompetitorPlayerOptions(selectedPairing?.tournamentCompetitor0)
  ), [selectedPairing]);
  const player1Options = useMemo(() => (
    getCompetitorPlayerOptions(selectedPairing?.tournamentCompetitor1)
  ), [selectedPairing]);

  // Automatically set "Player 1" if possible
  useEffect(() => {
    if (player0Options && player0Options.length === 1 && player0UserId !== player0Options[0].value) {
      setValue('player0UserId', player0Options[0].value);
    }
  }, [player0Options, player0UserId, setValue]);

  // Automatically set "Player 2" if possible
  useEffect(() => {
    if (player1Options && player1Options.length === 1 && player1UserId !== player1Options[0].value) {
      setValue('player1UserId', player1Options[0].value);
    }
  }, [player1Options, player1UserId, setValue]);

  return (
    <div className={styles.Root}>
      <div className={styles.Player0Section}>
        <FormField name="player0UserId" label={player0Label} disabled={player0Options.length < 2}>
          <InputSelect options={player0Options} />
        </FormField>
        <FormField name="details.player0BattlePlan" label="Battle Plan">
          <InputSelect options={fowV4BattlePlanOptions} />
        </FormField>
        <FormField name="details.player0UnitsLost" label="Units Lost">
          <InputText type="number" />
        </FormField>
      </div>
      <Separator orientation="vertical" />
      <div className={styles.Player1Section}>
        {player1Options.length ? (
          <FormField name="player1UserId" label={player1Label} disabled={player1Options.length < 2}>
            <InputSelect options={player1Options} />
          </FormField>
        ) : (
          <FormField name="player1Placeholder" label={player1Label} disabled>
            <InputText />
          </FormField>
        )}
        <FormField name="details.player1BattlePlan" label="Battle Plan">
          <InputSelect options={fowV4BattlePlanOptions} />
        </FormField>
        <FormField name="details.player1UnitsLost" label="Units Lost">
          <InputText type="number" />
        </FormField>
      </div>
    </div>
  );
};
