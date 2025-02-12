import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { getDraftMatch, getPairingOptions } from '~/components/FowV4MatchResultForm/FowV4MatchResultForm.utils';
import {
  getAttackerOptions,
  getFirstTurnOptions,
  getMissionOptions,
  GetOptionPlayersInput,
  getOutcomeTypeOptions,
  getWinnerOptions,
} from '~/components/FowV4MatchResultForm/missions';
import { Dialog } from '~/components/generic/Dialog';
import { Form, FormField } from '~/components/generic/Form';
import { InputNumber } from '~/components/generic/InputNumber';
import { InputSelect } from '~/components/generic/InputSelect';
import { Separator } from '~/components/generic/Separator';
import { MatchResultCard } from '~/components/MatchResultCard';
import { getCompetitorPlayerOptions } from '~/components/PlayerSelect/PlayerSelect.utils';
import { useCreateMatchResult } from '~/services/matchResults/useCreateMatchResult';
import { useFetchTournamentFull } from '~/services/tournaments/fetchTournamentFull';
import { fowV4StanceOptions } from '~/types/fowV4/fowV4StanceSchema';
import { TournamentMatchFormData, tournamentMatchFormSchema } from '~/types/Match';

import styles from './FowV4MatchResultForm.module.scss';

export interface FowV4MatchResultFormProps {
  id: string;
  className?: string;
  tournamentId?: string;
  onSuccess?: () => void;
}

export const FowV4MatchResultForm = ({
  id,
  className,
  tournamentId,
  onSuccess,
}: FowV4MatchResultFormProps): JSX.Element => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
  const { data: tournament } = useFetchTournamentFull(tournamentId);
  const addMatchResult = useCreateMatchResult();

  const form = useForm<TournamentMatchFormData>({
    resolver: zodResolver(tournamentMatchFormSchema),
    defaultValues: {
      tournament_pairing_id: undefined,
      attacker: undefined,
      first_turn: undefined,
      mission_id: undefined,
      outcome_type: undefined,
      player_0_id: undefined,
      player_0_stance: undefined,
      player_0_units_lost: undefined,
      player_1_id: undefined,
      player_1_stance: undefined,
      player_1_units_lost: undefined,
      turns_played: undefined,
      winner: undefined,
    },
    mode: 'onSubmit',
  });
  const { watch, handleSubmit, setValue } = form;

  const onSubmit: SubmitHandler<TournamentMatchFormData> = (): void => {
    setConfirmDialogOpen(true);
  };

  const onConfirmSubmit: SubmitHandler<TournamentMatchFormData> = async (data: TournamentMatchFormData): Promise<void> => {
    console.log('onsubmit', data);
    if (!tournament) {
      return;
    }
    const { game_system_config_id } = tournament;
    addMatchResult.mutate({ match: { ...data, game_system_config_id }, tournamentId: tournament.id }, {
      onSuccess: () => {
        setConfirmDialogOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  };

  const { player_0_id, player_1_id, tournament_pairing_id, player_0_stance, player_1_stance, mission_id, attacker, outcome_type, first_turn, winner } = watch();

  const selectedPairing = tournament?.pairings.find((pairing) => pairing.id === tournament_pairing_id);

  const pairingOptions = getPairingOptions(tournament?.pairings || [], tournament?.current_round || 0);

  // Automatically set "Player 1" if possible
  const player0Options = getCompetitorPlayerOptions(selectedPairing?.competitor_0);
  useEffect(() => {
    if (player0Options && player0Options.length === 1 && player_0_id !== player0Options[0].value) {
      setValue('player_0_id', player0Options[0].value);
    }
  }, [player0Options, player_0_id, setValue]);

  // Automatically set "PLayer 2" if possible
  const player1Options = getCompetitorPlayerOptions(selectedPairing?.competitor_1);
  useEffect(() => {
    if (player1Options && player1Options.length === 1 && player_1_id !== player1Options[0].value) {
      setValue('player_1_id', player1Options[0].value);
    }
  }, [player1Options, player_1_id, setValue]);

  const selectedPlayers: GetOptionPlayersInput = [
    { stance: player_0_stance, label: player0Options.find((option) => option.value === player_0_id)?.label || 'Unknown Player' },
    { stance: player_1_stance, label: player1Options.find((option) => option.value === player_1_id)?.label || 'Unknown Player' },
  ];

  // Mission
  const missionOptions = getMissionOptions(player_0_stance, player_1_stance, {
    matrixId: 'mission_pack_2023_04_extended_battle_plans',
    useAlternates: true,
  });

  // Attacker
  const attackerOptions = getAttackerOptions(selectedPlayers, mission_id);
  useEffect(() => {
    if (attackerOptions && attackerOptions.length === 1 && attacker !== attackerOptions[0].value) {
      setValue('attacker', attackerOptions[0].value);
    }
  }, [attackerOptions, attacker, setValue]);

  // First Turn
  const firstTurnOptions = getFirstTurnOptions(selectedPlayers, mission_id);
  useEffect(() => {
    if (firstTurnOptions && firstTurnOptions.length === 1 && first_turn !== firstTurnOptions[0].value) {
      setValue('first_turn', firstTurnOptions[0].value);
    }
  }, [firstTurnOptions, first_turn, setValue]);

  const outcomeTypeOptions = getOutcomeTypeOptions(mission_id);

  const winnerOptions = getWinnerOptions(selectedPlayers, mission_id, attacker, outcome_type);
  useEffect(() => {
    if (winnerOptions && winnerOptions.length === 1 && winner !== winnerOptions[0].value) {
      setValue('winner', winnerOptions[0].value);
    }
  }, [winnerOptions, winner, setValue]);

  const draftMatch = form.formState.isValid ? getDraftMatch(watch(), tournament) : null;

  return (
    <Form id={id} form={form} onSubmit={onSubmit} className={clsx(styles.FowV4MatchResultForm, className)}>
      <div>
        <FormField name="tournament_pairing_id" label="Result for">
          <InputSelect options={pairingOptions} />
        </FormField>
      </div>
      <Separator />
      <div className={styles.Root}>
        <div className={styles.OpponentsSection}>
          <div className={styles.Player0Section}>
            <FormField name="player_0_id" label="Player 1" disabled={player0Options.length < 2}>
              <InputSelect options={player0Options} />
            </FormField>
            <FormField name="player_0_stance" label="Stance">
              <InputSelect options={fowV4StanceOptions} />
            </FormField>
            <FormField name="player_0_units_lost" label="Units Lost">
              <InputNumber min={0} />
            </FormField>
          </div>
          <Separator orientation="vertical" />
          <div className={styles.Player1Section}>
            <FormField name="player_1_id" label="Player 2" disabled={player0Options.length < 2}>
              <InputSelect options={player1Options} />
            </FormField>
            <FormField name="player_1_stance" label="Stance">
              <InputSelect options={fowV4StanceOptions} />
            </FormField>
            <FormField name="player_1_units_lost" label="Units Lost">
              <InputNumber min={0} />
            </FormField>
          </div>
        </div>
        <Separator />
        <div className={styles.ResultsSection}>
          <FormField name="mission_id" label="Mission" disabled={!(player_0_stance && player_1_stance)}>
            <InputSelect options={missionOptions} />
          </FormField>
          <FormField name="attacker" label="Attacker" disabled={!mission_id || attackerOptions.length < 2}>
            <InputSelect options={attackerOptions} />
          </FormField>
          <FormField name="first_turn" label="First Turn" disabled={!mission_id || attacker === undefined || firstTurnOptions.length < 2}>
            <InputSelect options={firstTurnOptions} />
          </FormField>
          <div className={styles.OutcomeSection}>
            <FormField name="turns_played" label="Rounds" >
              <InputNumber min={0} />
            </FormField>
            <FormField name="outcome_type" label="Outcome Type" disabled={!mission_id}>
              <InputSelect options={outcomeTypeOptions} />
            </FormField>
          </div>
          <FormField name="winner" label="Winner" disabled={!mission_id || !outcome_type || winnerOptions.length < 2}>
            <InputSelect options={winnerOptions} />
          </FormField>
        </div>
      </div>
      <Dialog
        title="Are all details correct?"
        description="After you submit the match you will still be able to add notes and photos, but the game configuration and outcome can no longer be changed!"
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        width="small"
        actions={[
          { label: 'Cancel', muted: true, onClick: () => setConfirmDialogOpen(false) },
          { label: 'Submit Match', onClick: handleSubmit(onConfirmSubmit) },
        ]}
      >
        <div className={'ConfirmDialogMatchCard'}>
          {draftMatch && (
            <MatchResultCard matchData={draftMatch} />
          )}
        </div>
      </Dialog>
    </Form>
  );
};