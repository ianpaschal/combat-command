import { useEffect, useState } from 'react';
import {
  Controller,
  get,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { FowV4MatchOutcomeFormSection } from '~/components/FowV4MatchOutcomeFormSection/FowV4MatchOutcomeFormSection';
import {
  getDraftMatch,
  getPairingOptions,
  getSelectedPairing,
} from '~/components/FowV4MatchResultForm/FowV4MatchResultForm.utils';
import { Dialog } from '~/components/generic/Dialog';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect } from '~/components/generic/InputSelect';
import { Separator } from '~/components/generic/Separator';
import { MatchResultCard } from '~/components/MatchResultCard';
import { PlayerSelect } from '~/components/PlayerSelect';
import { getCompetitorPlayerOptions } from '~/components/PlayerSelect/PlayerSelect.utils';
import { useAddMatchResult } from '~/services/matchResults/addMatchResult';
import { useFetchTournamentFull } from '~/services/tournaments/fetchTournamentFull';
import { TournamentMatchFormData, tournamentMatchFormSchema } from '~/types/Match';

import './FowV4MatchResultForm.scss';

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
  const addMatchResult = useAddMatchResult();

  const form = useForm<TournamentMatchFormData>({
    resolver: zodResolver(tournamentMatchFormSchema),
    defaultValues: {
      tournament_pairing_id: null,
      player_0_id: '',
      player_1_id: '',
      outcome: {
        mission_id: undefined,
        outcome_type: undefined,
        winner: undefined,
        turns_played: 1,
        attacker: undefined,
        firstTurn: undefined,
        player_0_stance: undefined,
        player_0_units_lost: 0,
        player_1_stance: undefined,
        player_1_units_lost: 0,
      },
    },
    mode: 'onSubmit',
  });
  const { watch, handleSubmit, reset } = form;

  const onSubmit: SubmitHandler<TournamentMatchFormData> = (): void => {
    setConfirmDialogOpen(true);
  };

  const onConfirmSubmit: SubmitHandler<TournamentMatchFormData> = async (data: TournamentMatchFormData): Promise<void> => {
    console.log('onsubmit', data);
    if (!tournament) {
      return;
    }
    const { game_system_config_id } = tournament;
    addMatchResult.mutate({ ...data, game_system_config_id }, {
      onSuccess: () => {
        setConfirmDialogOpen(false);
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  };

  const { player_0_id, player_1_id, tournament_pairing_id } = watch();

  const selectedPairing = getSelectedPairing(tournament_pairing_id, tournament?.pairings || []);

  // Reset player values if pairing is changed
  useEffect(() => {
    reset((prev) => ({ ...prev, player_0_id: '', player_1_id: '' }));
  }, [reset, tournament_pairing_id]);

  const pairingOptions = getPairingOptions(tournament?.pairings || []);
  const player0Options = getCompetitorPlayerOptions(selectedPairing?.competitor_0);
  const player1Options = getCompetitorPlayerOptions(selectedPairing?.competitor_1);
  const playerLabels = [
    ...player0Options.filter((option) => option.value === player_0_id),
    ...player1Options.filter((option) => option.value === player_1_id),
  ].map(({ label }) => label);

  const draftMatch = getDraftMatch(watch(), tournament);

  console.log('draftMatch', draftMatch);
  console.log('raw', watch());

  return (
    <Form id={id} form={form} onSubmit={onSubmit} className={clsx('FowV4MatchResultForm', className)}>
      <div className="GameMetaSection">
        <FormField name="tournament_pairing_id" label="Result for">
          <InputSelect options={pairingOptions} />
        </FormField>
      </div>
      <Separator />
      {/* TODO: Improve the player selects so they have an edit button */}
      <FowV4MatchOutcomeFormSection
        playerLabels={playerLabels}
        player0Select={
          <Controller
            control={form.control}
            name={'player_0_id'}
            render={({ field }) => (
              <PlayerSelect
                value={field.value}
                options={player0Options}
                onChange={field.onChange}
                hasError={!!get(form.formState.errors, 'player_0_id')}
              />
            )}
          />
        }
        player1Select={
          <Controller
            control={form.control}
            name={'player_1_id'}
            render={({ field }) => (
              <PlayerSelect
                value={field.value}
                options={player1Options}
                onChange={field.onChange}
                hasError={!!get(form.formState.errors, 'player_1_id')}
              />
            )}
          />
        }
      />
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