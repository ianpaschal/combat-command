import { useEffect, useState } from 'react';
import {
  Controller,
  get,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { useAuth } from '~/components/AuthProvider';
import { getRolesByStances, missions } from '~/components/FowV4MatchResultForm/missions';
import { FowV4TournamentGameConfigForm } from '~/components/FowV4TournamentGameConfigForm';
import { Animate } from '~/components/generic/Animate';
import { Avatar } from '~/components/generic/Avatar';
import { Button } from '~/components/generic/Button';
import { Dialog } from '~/components/generic/Dialog';
import { Form, FormField } from '~/components/generic/Form';
import { InputSelect, InputSelectItem } from '~/components/generic/InputSelect';
import { SelectValue } from '~/components/generic/InputSelect/InputSelect.types';
import { InputText } from '~/components/generic/InputText';
import { Separator } from '~/components/generic/Separator';
import { MatchResultCard } from '~/components/MatchResultCard';
import { PlayerSelect } from '~/components/PlayerSelect';
import { UserPortrait } from '~/components/UserPortrait';
import { fowV4LFTFVersionOptions } from '~/types/fowV4/fowV4LFTFVersionSchema';
import { fowV4OutcomeTypeOptions } from '~/types/fowV4/fowV4MatchOutcomeTypeSchema';
import { fowV4MissionPackVersionOptions } from '~/types/fowV4/fowV4MissionPackVersionSchema';
import { fowV4StanceOptions } from '~/types/fowV4/fowV4StanceSchema';
import { Match, matchSchema } from '~/types/Match';

import './FowV4MatchResultForm.scss';

export interface FowV4MatchResultFormProps {
  className?: string;
  tournamentId?: string;
  matchResultId?: string;
  onSuccess?: () => void;
}

export const FowV4MatchResultForm = ({
  className,
  tournamentId,
  onSuccess,
}: FowV4MatchResultFormProps): JSX.Element => {
  const user = useAuth();
  const [loading] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  // TODO:
  // If tournamentId !== undefined, get the correct pairing which includes this user
  // If matchId !== populate all default values from that (editing)

  const form = useForm<Match>({
    resolver: zodResolver(matchSchema),
    defaultValues: {
      tournament_pairing_id: 'NONE',

      // Auto-filled & disabled if tournament pairing ID is not undefined
      game_system_id: 'flames_of_war_v4', // Hidden
      game_system_config: {
        era: 'lw',
        points: 100,
        lessons_from_the_front_version: [...fowV4LFTFVersionOptions].pop()?.value,
        mission_pack_version: [...fowV4MissionPackVersionOptions].pop()?.value,
      },

      players: [
        {
          user_id: user!.id,
          list_id: undefined,
          confirmed: true,
        },
        {
          user_id: undefined,
          list_id: undefined,
          confirmed: false,
        },
      ],
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
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<Match> = (data): void => {
    console.log(data, typeof data.outcome.attacker);
    setConfirmDialogOpen(true);
  };

  const onConfirmSubmit: SubmitHandler<Match> = async (data: Match): Promise<void> => {
    setConfirmDialogOpen(false);
    console.log('Submitted', data);
    // If success trigger the onSuccess prop
    if (onSuccess) {
      onSuccess();
    }
  };

  const pairingOptions: InputSelectItem<SelectValue>[] = [
    { label: 'Single Match', value: null },
    '-' as const,
    { label: 'Operation Bagration', value: 'foo' },
    { label: 'Operation Overlord', value: 'bar' },
  ];
  const playerOptions: InputSelectItem<SelectValue>[] = [
    { label: 'Player 1', value: 0 },
    { label: 'Player 2', value: 1 },
  ];

  const { watch, setValue, handleSubmit } = form;
  const { outcome: {
    player_0_stance,
    player_1_stance,
    mission_id,
    outcome_type,
    attacker,
  }, tournament_pairing_id } = watch();

  const selectedMission = missions.find((mission) => mission.id === mission_id);

  // Automatically set attacker based on mission and stances
  useEffect(() => {
    if (player_0_stance && player_1_stance) {
      const roles = getRolesByStances(player_0_stance, player_1_stance);
      if (roles && selectedMission && selectedMission.attacker !== 'roll') {
        setValue('outcome.attacker', roles.attacker);
      }
    }
  }, [setValue, selectedMission, player_0_stance, player_1_stance]);

  // Automatically set firstTurn based on mission and attacker
  useEffect(() => {
    if (attacker !== undefined) {
      const defender = attacker === 0 ? 1 : 0;
      if (selectedMission && selectedMission.firstTurn !== 'roll') {
        setValue('outcome.firstTurn', selectedMission.firstTurn === 'attacker' ? attacker : defender);
      }
    }
  }, [setValue, selectedMission, attacker]);

  const showGameConfigSection = tournament_pairing_id === 'NONE';
  const showAttacker = (!!player_0_stance && !!player_1_stance && player_0_stance === player_1_stance) || selectedMission?.attacker === 'roll';
  const showFirstTurn = selectedMission?.firstTurn === 'roll';
  const showWinnerField = !!outcome_type && outcome_type !== 'time_out';

  return (
    <Form form={form} onSubmit={onSubmit} className={clsx('FowV4MatchResultForm', className)}>
      <div className="GameMetaSection">
        <FormField name="tournament_pairing_id" label="Result for" disabled={!!tournamentId}>
          <InputSelect options={pairingOptions} />
        </FormField>
      </div>
      <Separator />
      <Animate show={showGameConfigSection}>
        <div className="GameConfigSection" data-state={showGameConfigSection ? 'open' : 'closed'}>
          <FowV4TournamentGameConfigForm fieldName="game_system_config" hideRuleAddOns />
          <Separator />
        </div>
      </Animate>
      <div className="OpponentsSection">
        <div className="Player0Section">
          <UserPortrait name="FooBar">
            <Avatar />
          </UserPortrait>
          <FormField name="outcome.player_0_stance" label="Stance">
            <InputSelect options={fowV4StanceOptions} />
          </FormField>
          <FormField name="outcome.player_0_units_lost" label="Units Lost">
            <InputText type="number" min={0} />
          </FormField>
        </div>
        <Separator orientation="vertical" />
        <div className="Player1Section">
          <Controller
            control={form.control}
            name={'players.1.user_id'}
            render={({ field }) => (
              <PlayerSelect value={field.value} onChange={field.onChange} hasError={!!get(form.formState.errors, 'players.1.user_id')} />
            )}
          />
          <FormField name="outcome.player_1_stance" label="Stance">
            <InputSelect options={fowV4StanceOptions} />
          </FormField>
          <FormField name="outcome.player_1_units_lost" label="Units Lost">
            <InputText type="number" min={0} />
          </FormField>
        </div>
      </div>
      <Separator />
      <div className="ResultsSection">
        <FormField name="outcome.mission_id" label="Mission">
          <InputSelect options={missions.map(({ label, id }) => ({ label, value: id }))} />
        </FormField>
        <Animate show={showAttacker}>
          <FormField name="outcome.attacker" label="Attacker">
            <InputSelect options={playerOptions} />
          </FormField>
        </Animate>
        <Animate show={showFirstTurn}>
          <FormField name="outcome.firstTurn" label="First Turn">
            <InputSelect options={playerOptions} />
          </FormField>
        </Animate>
        <div className="OutcomeSection">
          <FormField name="outcome.turns_played" label="Rounds Played" >
            <InputText type="number" min={0} />
          </FormField>
          <FormField name="outcome.outcome_type" label="Outcome Type">
            <InputSelect options={fowV4OutcomeTypeOptions} />
          </FormField>
        </div>
        <Animate show={showWinnerField}>
          <FormField name="outcome.winner" label="Winner" >
            <InputSelect options={playerOptions} />
          </FormField>
        </Animate>
      </div>
      <Button disabled={loading} type="submit" className="SubmitButton">
        Check In Match
      </Button>
      <Dialog
        title="Are all details correct?"
        description="After you submit the match you will still be able to add notes and photos, but the game configuration and outcome can no longer be changed!"
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        maxWidth={400}
        actions={[
          { label: 'Cancel', muted: true, cancel: true },
          { label: 'Submit Match', onClick: handleSubmit(onConfirmSubmit) },
        ]}
      >
        <div className={'ConfirmDialogMatchCard'}>
          <MatchResultCard matchData={watch()} />
        </div>
      </Dialog>
    </Form>
  );
};