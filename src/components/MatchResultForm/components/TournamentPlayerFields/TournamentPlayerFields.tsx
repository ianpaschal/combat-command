import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { Tournament, TournamentPairingId } from '~/api';
import { FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { InputText } from '~/components/generic/InputText';
import { useGetTournamentPairing } from '~/services/tournamentPairings';
import { getCompetitorPlayerOptions } from './TournamentPlayerFields.utils';

import styles from './TournamentPlayerFields.module.scss';

export interface TournamentPlayerFieldsProps {
  tournamentPairingId: TournamentPairingId;
  tournament?: Tournament | null;
}

export const TournamentPlayerFields = ({
  tournamentPairingId,
  tournament,
}: TournamentPlayerFieldsProps): JSX.Element => {
  const { setValue, watch } = useFormContext();
  const player0UserId = watch('player0UserId');
  const player1UserId = watch('player1UserId');
  const player0Faction = watch('details.player0Faction');
  const player1Faction = watch('details.player1Faction');

  const { data: selectedPairing } = useGetTournamentPairing({ id: tournamentPairingId });

  const player0Label = tournament?.useTeams && selectedPairing?.tournamentCompetitor0 ? `${selectedPairing.tournamentCompetitor0.displayName} Player` : 'Player 1';
  const player1Label = tournament?.useTeams && selectedPairing?.tournamentCompetitor1 ? `${selectedPairing.tournamentCompetitor1.displayName} Player` : 'Player 2';

  const player0Options = getCompetitorPlayerOptions(selectedPairing?.tournamentCompetitor0);
  const player1Options = getCompetitorPlayerOptions(selectedPairing?.tournamentCompetitor1);

  const player0Registration = useMemo(() => (
    selectedPairing?.tournamentCompetitor0?.registrations.find((r) => r.userId === player0UserId)
  ), [selectedPairing, player0UserId]);
  const player1Registration = useMemo(() => (
    selectedPairing?.tournamentCompetitor1?.registrations.find((r) => r.userId === player1UserId)
  ), [selectedPairing, player1UserId]);

  // Automatically set "Player 1" if possible
  useEffect(() => {
    if (player0Options && player0Options.length === 1 && player0UserId !== player0Options[0].value) {
      setValue('player0UserId', player0Options[0].value);
    }
  }, [player0Options, player0UserId, setValue]);

  // Automatically set "Player 1" faction if possible
  useEffect(() => {
    if (player0Registration && player0Registration.factions.length > 0 && player0Faction !== player0Registration.factions[0]) {
      setValue('details.player0Faction', player0Registration.factions[0]);
    }
  }, [player0Registration, player0Faction, setValue]);

  // Automatically set "Player 2" if possible
  useEffect(() => {
    if (player1Options && player1Options.length === 1 && player1UserId !== player1Options[0].value) {
      setValue('player1UserId', player1Options[0].value);
    }
  }, [player1Options, player1UserId, setValue]);

  // Automatically set "Player 2" faction if possible
  useEffect(() => {
    if (player1Registration && player1Registration.factions.length > 0 && player1Faction !== player1Registration.factions[0]) {
      setValue('details.player1Faction', player1Registration.factions[0]);
    }
  }, [player1Registration, player1Faction, setValue]);

  if (!selectedPairing) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.Root}>
      <div className={styles.Player0Section}>
        <FormField name="player0UserId" label={player0Label} disabled={player0Options.length < 2}>
          <InputSelect options={player0Options} />
        </FormField>
      </div>
      <div className={styles.Player1Section}>
        {player1Options.length ? (
          <FormField name="player1UserId" label={player1Label} disabled={player1Options.length < 2}>
            <InputSelect options={player1Options} />
          </FormField>
        ) : (
          <FormField name="player1Placeholder" label={player1Label}>
            <InputText />
          </FormField>
        )}
      </div>
    </div>
  );
};
